import { NextApiRequest, NextApiResponse } from 'next';
import { queryAIResult } from '../../src/lib/ai';  // Função para consultar o resultado

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID é necessário' });
    }

    try {
      // Chama a função para consultar o resultado da detecção
      const queryResult = await queryAIResult(id);  // Chama a API de consulta com o ID

      return res.status(200).json(queryResult);  // Retorna o resultado da consulta

    } catch (error) {
      console.error('Erro na consulta:', error);
      return res.status(500).json({ message: 'Erro ao consultar resultado' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
