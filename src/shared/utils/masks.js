export function mascaraTelefone(valor) {
  valor = valor.replace(/\D/g, '');

  if (valor.length <= 10) {
    return valor
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return valor
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function mascaraCep(valor) {
  console.log(valor.value);

  if(valor) {
      valor = valor.replace(/\D/g, '');
    
      return valor
        .replace(/^(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
  }
  return '';
}