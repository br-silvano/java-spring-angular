export function CepPattern() {
  return new RegExp(/^([0-9]{5})[-\s]{1}([0-9]{3})$/);
}
