export type PasswordStrength = {
  label: string;
  toneClassName: string;
  widthClassName: string;
  score: number;
};

const toneClasses = [
  "bg-[var(--color-border)]",
  "bg-[#d6455d]",
  "bg-[#f08c2e]",
  "bg-[#d4b22b]",
  "bg-[var(--color-success)]",
] as const;

const widthClasses = [
  "w-0",
  "w-1/4",
  "w-2/4",
  "w-3/4",
  "w-full",
] as const;

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      label: "Empieza a escribir tu contrasena",
      toneClassName: toneClasses[0],
      widthClassName: widthClasses[0],
      score: 0,
    };
  }

  let score = 0;

  if (password.length >= 6) {
    score += 1;
  }

  if (/[A-Za-z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z\d]/.test(password)) {
    score += 1;
  }

  const labels = [
    "Muy debil",
    "Poco segura",
    "Aceptable",
    "Buena",
    "Segura",
  ] as const;

  return {
    label: labels[score],
    toneClassName: toneClasses[score],
    widthClassName: widthClasses[score],
    score,
  };
}
