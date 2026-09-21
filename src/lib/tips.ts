const TIPS = [
  "Separar um Pix assim que o salário cai evita que o dinheiro da meta suma no meio do mês.",
  "Pequenos gastos do dia a dia somados costumam pesar mais que uma compra grande — vale registrar tudo.",
  "Revisar as contas fixas a cada 6 meses pode revelar assinaturas que ninguém mais usa.",
  "Combinar um dia por semana para olhar as finanças juntos ajuda a manter o hábito.",
  "Uma reserva de emergência não precisa nascer completa — guardar pouco e sempre já é progresso.",
  "Dívidas com juros mais altos custam mais caro quanto mais tempo ficam paradas — ataque essas primeiro.",
  "Definir um limite por categoria facilita perceber onde o dinheiro está de fato indo.",
];

export function tipOfTheDay(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return TIPS[dayOfYear % TIPS.length];
}
