import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validate = (schema: ZodObject<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida o que foi definido no schema (pode ser body, query ou params)
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      return next(); // Dados válidos, prossegue para o Controller
    } catch (error) {
      if (error instanceof ZodError) {
        // Formata os erros do Zod para o cliente entender facilmente
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join(".").replace(/^body\.|^query\.|^params\./, ""),
          message: err.message,
        }));

        return res.status(400).json({
          status: "fail",
          errors: errorMessages,
        });
      }

      return res.status(500).json({ error: "Internal server error during validation" });
    }
  };
};