import { registrarPonentes } from './seeders/ponentes.js';
import { copiarImagenesPonentes } from './seeders/copiarImagenes.js';

// Lista de seeders disponibles
const SEEDERS = {
  ponentes: { fn: registrarPonentes, nombre: 'Ponentes' },
  imagenes: { fn: copiarImagenesPonentes, nombre: 'Imágenes de ponentes' }
};

// Ejecutar un seeder específico
const ejecutarSeeder = async (nombre) => {
  const seeder = SEEDERS[nombre];
  
  if (!seeder) {
    console.log(`❌ Seeder "${nombre}" no encontrado`);
    console.log(`📋 Seeders disponibles: ${Object.keys(SEEDERS).join(', ')}`);
    return false;
  }
  
  console.log(`==== EJECUTANDO SEEDER: ${seeder.nombre} ====`);
  const resultado = await seeder.fn();
  
  if (resultado) {
    console.log(`✅ Seeder "${nombre}" ejecutado correctamente`);
  } else {
    console.log(`❌ Error al ejecutar seeder "${nombre}"`);
  }
  
  return resultado;
};

// Ejecutar todos los seeders
const ejecutarTodos = async () => {
  console.log('==== EJECUTANDO TODOS LOS SEEDERS ====');
  
  // Ejecutar seeders en orden secuencial
  for (const [nombre, seeder] of Object.entries(SEEDERS)) {
    console.log(`\n---- SEEDER: ${seeder.nombre} ----`);
    await seeder.fn();
  }
  
  console.log('\n✅✅✅ TODOS LOS SEEDERS COMPLETADOS');
};

// Determinar qué ejecutar basado en los argumentos
const main = async () => {
  const seederArg = process.argv[2];
  
  if (!seederArg) {
    // Sin argumentos, ejecutar todos
    await ejecutarTodos();
  } else if (SEEDERS[seederArg]) {
    // Ejecutar seeder específico
    await ejecutarSeeder(seederArg);
  } else {
    console.log(`❌ Seeder "${seederArg}" no encontrado`);
    console.log(`📋 Seeders disponibles: ${Object.keys(SEEDERS).join(', ')}`);
  }
  
  // Finalizar proceso
  process.exit(0);
};

// Ejecutar script
main().catch(error => {
  console.error('❌ Error general:', error);
  process.exit(1);
});