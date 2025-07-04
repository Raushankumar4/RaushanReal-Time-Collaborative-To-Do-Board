const useFormValidation = (form, requiredFields = []) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!form[field]) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    }
  });

  return errors;
};

export default useFormValidation;
