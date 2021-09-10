import React, { useState, useEffect } from "react";
import { Container } from "./styles";
import api from "../../services/api";

interface Pessoa {
    telefone: String
    nome: String
}


const Dashboard:React.FC = () => {
    // useffect uma funcao que vai ser utilizada toda vez que a pagina for carregada

    // criando um array de pessoas do tipo interface pessoa
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    useEffect(() => {

        // prenchando os dados da resposta dentro do useState de pessoa
        api.get("/pessoas").then(response => {
            setPessoas(response.data)
        });
    }, []);
    return (
        <>
            <Container>
                <h1>Apenas</h1>

                {/* mapeando o array de pessoas e jogando as informacoes dentro do que precisa, toda vez que tiver uma nova id */}
                {pessoas.map(pessoa => 
                <div>
                    <p>{pessoa.nome}</p>
                    <p>{pessoa.telefone}</p>
                </div>
                )}
            </Container>
        </>
    );
};

export default Dashboard;