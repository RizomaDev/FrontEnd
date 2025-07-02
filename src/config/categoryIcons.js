import {
  faLeaf,          // Medio Ambiente
  faVenusMars,     // Feminismos
  faBuilding,      // Servicios Públicos
  faHome,          // Vivienda
  faCity,          // Urbanismo
  faBus,           // Movilidad
  faPalette,       // Cultura
  faBriefcase,     // Economía y empleo
  faFutbol,        // Deporte
  faMonument       // Memoria democrática
} from '@fortawesome/free-solid-svg-icons';

// Exportar las constantes para poder usarlas en otros componentes
export const categoryColors = {
  'Conflictos': 'primary',    // Rojo
  'Propuestas': 'secondary',    // Verde azulado
  'Iniciativas': 'accent'    // Dorado
};

export const tagIcons = {
  'Medio Ambiente': faLeaf,
  'Feminismos': faVenusMars,
  'Servicios Públicos': faBuilding,
  'Vivienda': faHome,
  'Urbanismo': faCity,
  'Movilidad': faBus,
  'Cultura': faPalette,
  'Economía y empleo': faBriefcase,
  'Deporte': faFutbol,
  'Memoria democrática': faMonument
}; 