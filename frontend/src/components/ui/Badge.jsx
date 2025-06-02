
export const Badge = ({ categoria }) => {
  const getStyles = (cat) => {
    const catLower = cat?.toLowerCase() || '';
    
    // Objeto con los estilos por categoría
    const styles = {
      frontend: { bg: 'bg-categoria-frontend bg-opacity-10', text: 'text-categoria-frontend' },
      backend: { bg: 'bg-categoria-backend bg-opacity-10', text: 'text-categoria-backend' },
      javascript: { bg: 'bg-categoria-javascript bg-opacity-10', text: 'text-categoria-javascript' },
      php: { bg: 'bg-categoria-php bg-opacity-10', text: 'text-categoria-php' },
      ux: { bg: 'bg-categoria-ux bg-opacity-10', text: 'text-categoria-ux' },
      wordpress: { bg: 'bg-categoria-wordpress bg-opacity-10', text: 'text-categoria-wordpress' },
      react: { bg: 'bg-categoria-react bg-opacity-10', text: 'text-categoria-react' },
      vue: { bg: 'bg-categoria-vue bg-opacity-10', text: 'text-categoria-vue' },
      devops: { bg: 'bg-categoria-devops bg-opacity-10', text: 'text-categoria-devops' },
      default: { bg: 'bg-primary bg-opacity-10', text: 'text-primary' }
    };
    
    // Buscar la categoría que coincida
    for (const key in styles) {
      if (catLower.includes(key)) {
        return styles[key];
      }
    }
    
    return styles.default;
  };
  
  const { bg, text } = getStyles(categoria);
  
  return (
    <span className={`categoria-badge ${bg} ${text}`}>
      {categoria}
    </span>
  );
};


export default Badge;