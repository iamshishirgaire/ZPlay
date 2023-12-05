const validateSchema = (schema) => async (req, res, next) => {
  try {
    //if we  use default values while defining the schema then we need to
    //forward the object created by yup to the next function
    const validatedBody = await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      { abortEarly: false }
    );
    req.body = validatedBody.body;

    return next();
  } catch (err) {
    res.status(400).json({ errorMessage: err.errors });
  }
};
export { validateSchema };
