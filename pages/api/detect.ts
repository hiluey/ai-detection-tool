import { NextApiRequest, NextApiResponse } from 'next';
import { detectAI } from '../../src/lib/ai';  // Função para fazer a detecção

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Texto é necessário' });
    }

    try {
      // Chama a função para detectar IA no backend
      const detectResult = await detectAI(text);  // Chama a API de detecção
      return res.status(200).json({ id: detectResult.id });  // Retorna o ID da detecção

    } catch (error) {
      console.error('Erro na detecção:', error);
      return res.status(500).json({ message: 'Erro ao detectar IA' });
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}
