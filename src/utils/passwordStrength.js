export const checkPasswordStrength = (password) => {
  const requirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;
  
  let strength = 'Very Weak';
  let color = 'text-red-500';
  let bgColor = 'bg-red-500';
  let percentage = 0;

  if (score >= 5) {
    strength = 'Very Strong';
    color = 'text-green-600';
    bgColor = 'bg-green-500';
    percentage = 100;
  } else if (score >= 4) {
    strength = 'Strong';
    color = 'text-green-500';
    bgColor = 'bg-green-400';
    percentage = 80;
  } else if (score >= 3) {
    strength = 'Medium';
    color = 'text-yellow-500';
    bgColor = 'bg-yellow-500';
    percentage = 60;
  } else if (score >= 2) {
    strength = 'Weak';
    color = 'text-orange-500';
    bgColor = 'bg-orange-500';
    percentage = 40;
  } else if (score >= 1) {
    strength = 'Very Weak';
    color = 'text-red-500';
    bgColor = 'bg-red-500';
    percentage = 20;
  }

  return {
    requirements,
    score,
    strength,
    color,
    bgColor,
    percentage,
    isStrong: score >= 4
  };
};

export const getPasswordRequirements = () => [
  { key: 'length', text: 'At least 8 characters', icon: '📏' },
  { key: 'lowercase', text: 'One lowercase letter', icon: '🔤' },
  { key: 'uppercase', text: 'One uppercase letter', icon: '🔠' },
  { key: 'number', text: 'One number', icon: '🔢' },
  { key: 'special', text: 'One special character', icon: '🔣' },
];
