export function TelefonePattern() {
  return new RegExp(/^\(?([0-9]{2})\)[\s]{1}([0-9]{4}|[0-9]{5})[-\s]{1}([0-9]{4})$/);
}
