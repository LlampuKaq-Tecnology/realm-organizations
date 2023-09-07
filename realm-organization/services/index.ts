export const formatOrganization = (text?: string) => {
  const res = text?.replace(/ /g, "").toLowerCase();
  return res?.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
