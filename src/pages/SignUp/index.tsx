import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiUser, FiLock } from 'react-icons/fi';
import { Form } from "@unform/web";
import * as Yup from "yup";
import { FormHandles } from '@unform/core';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import { Container, Content, Background } from './styles';

import Input from "../../components/Input";
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import { Link, useHistory } from 'react-router-dom';

interface SignUpFormData {
  email: string;
  senha: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { addToast } = useToast();

  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
            email: Yup.string().required('E-mail obrigatório').email('Informe um e-mail válido'),
            senha: Yup.string().min(6, 'No mínimo 6 digitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        })
        await api.post('/pessoas/usuario', data);

        history.push('/')

        addToast({
          type: 'success',
          title: 'Cadastro realizado',
          description: 'Voce ja pode realizar seu login',
        })

    } catch(err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);

      return

      }

      addToast ({
        type: 'error',
        title: 'erro',
        description: 'erro',
      })
    }
  }, [addToast, history]);

  return (
    <Container>
      <Background />
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu Cadastro</h1>

          <Input icon={FiUser} name="email" placeholder="Email" />
          <Input icon={FiLock} name="senha" type="password" placeholder="Senha" />

          <Button type="submit">Cadastrar</Button> 
        </Form>

        <Link to="/">
          <FiArrowLeft />
          Voltar para o Login
        </Link>
      </Content>
    </Container>
  );
};

export default SignUp;