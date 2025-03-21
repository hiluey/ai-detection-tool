import axios from 'axios';

const API_KEY = '8895035d-0dd9-43ab-97a0-9aed70bb885d';  // Sua chave de API
const DETECT_URL = 'https://ai-detect.undetectable.ai/detect';  // URL da API de detecção
const QUERY_URL = 'https://ai-detect.undetectable.ai/query';  // URL da API de consulta

// Função de detecção
export async function detectAI(text: string) {
  try {
    const response = await axios.post(DETECT_URL, {
      text: text,
      key: API_KEY,
      model: 'xlm_ud_detector',
      retry_count: 0
    });

    return response.data;  // Retorna os dados da resposta da API
  } catch (error) {
    console.error('Erro ao enviar o texto para a API de detecção:', error);
    throw new Error('Falha ao tentar detectar IA');
  }
}

// Função de consulta
export async function queryAIResult(id: string) {
  try {
    const response = await axios.post(QUERY_URL, {
      key: API_KEY,
      id: id  // ID da detecção
    });

    return response.data;  // Retorna os dados da resposta da consulta
  } catch (error) {
    console.error('Erro ao consultar o resultado:', error);
    throw new Error('Falha ao consultar o resultado da detecção');
  }
}
