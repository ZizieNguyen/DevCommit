export const paginacion = (req, res, next) => {
  // Obtener parámetros de consulta
  const pagina = Number(req.query.pagina) || 1;
  const limite = Number(req.query.limite) || 10;
  
  // Validar valores
  if (pagina < 1) req.query.pagina = 1;
  if (limite < 1 || limite > 100) req.query.limite = 10;
  
  // Calcular offset para SQL
  const offset = (pagina - 1) * limite;
  
  // Agregar a la solicitud
  req.paginacion = {
    pagina,
    limite,
    offset
  };
  
  next();
};