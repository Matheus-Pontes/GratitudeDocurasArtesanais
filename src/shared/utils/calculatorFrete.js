export async function buscarEndereco(cep) {
  const cepLimpo = cep.replace(/\D/g, '');
  if (cepLimpo.length !== 8) throw new Error('CEP inválido');
  const res = await fetch(`https://cep.awesomeapi.com.br/json/${cepLimpo}`);
  if (!res.ok) throw new Error('CEP não encontrado na AwesomeAPI');
  const data = await res.json();
  if (!data.lat || !data.lng) throw new Error('CEP sem coordenadas na AwesomeAPI');
  return {
    logradouro: data.address,
    bairro: data.district,
    localidade: data.city,
    uf: data.state,
    lat: parseFloat(data.lat),
    lon: parseFloat(data.lng),
  };
}

export async function distanciaOSRM(origem, destino) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origem.lon},${origem.lat};${destino.lon},${destino.lat}?overview=false`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error('OSRM não conseguiu calcular a rota');
  return data.routes[0].distance / 1000; // km
}