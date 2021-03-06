import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import { Container, Content, Background } from './styles';
import Input from "../../components/Input";
import Button from '../../components/Button';
import * as Yup from "yup"

import { useAuth } from '../../hooks/auth';
import { Form } from '@unform/web';
import getValidationErrors from '../../utils/getValidationErrors';
import { FormHandles } from '@unform/core';
import { useToast } from '../../hooks/toast';
import { Link, useHistory } from 'react-router-dom';

interface SignInData {
  email: string;
  senha: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(async (data: SignInData) => {
    try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
            email: Yup.string().required('E-mail obrigatório').email('Informe um e-mail válido'),
            senha: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
            abortEarly: false,
        });

        await signIn({
          email: data.email,
          senha: data.senha
        });

        history.push('/dashboard');

    } catch(err) {
      
      if(err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current?.setErrors(errors);

        return
      }

      addToast({
        type: "error",
        title: "Ocorreu um erro na autenticação",
        description: "Ocorreu um erro ao fazer login"
      });
    }
  }, [signIn, addToast, history]);

  return(
    <Container>
      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <h1>Faça seu Login</h1>

          <Input icon={FiMail} name="email" placeholder="Email" />
          <Input icon={FiLock} name="senha" type="password" placeholder="Senha" />

          <Button type="submit">Entrar</Button>

          <a href="./">Esqueci minha senha</a> 
        </Form>

        <Link to="./signup">
          <FiLogIn />
          Criar conta
        </Link>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;