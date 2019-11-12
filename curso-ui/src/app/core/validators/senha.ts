export function SenhaPattern() {
  return new RegExp(/^(?=.*[A-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@])\S{6,12}$/);
}
