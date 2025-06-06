export function useColisoes() {
  const templos = [
    {
      x: 65, y: 100, largura: 125, altura: 215,
      porta: { x: 70, y: 305, largura: 115, altura: 10 },
    },
    {
      x: 265, y: 10, largura: 125, altura: 215,
      porta: { x: 270, y: 215, largura: 120, altura: 10 },
    },
    {
      x: 475, y: 90, largura: 125, altura: 215,
      porta: { x: 480, y: 295, largura: 120, altura: 10 },
    },
  ];

  const aviao = {
    x: 145,
    y: 400,
    largura: 43,
    altura: 50,
    porta: {
      x: 145,
      y: 410,
      largura: 8,
      altura: 30,
    },
  };

  function retangulosColidem(r1, r2) {
    return !(
      r1.x + r1.largura < r2.x ||
      r1.x > r2.x + r2.largura ||
      r1.y + r1.altura < r2.y ||
      r1.y > r2.y + r2.altura
    );
  }

  function verificaColisaoTemplos(retangulo) {
    return templos.some(templo => retangulosColidem(retangulo, templo));
  }

  function verificaColisaoAviao(retangulo) {
    return retangulosColidem(retangulo, aviao);
  }

  function verificaColisaoPorta(retangulo) {
    const temploComPorta = templos.find(templo => retangulosColidem(retangulo, templo.porta));
    if (temploComPorta) return temploComPorta;

    if (retangulosColidem(retangulo, aviao.porta)) return aviao;

    return null;
  }

  return {
    templos,
    aviao,
    retangulosColidem,
    verificaColisaoTemplos,
    verificaColisaoAviao,
    verificaColisaoPorta,
  };
}
