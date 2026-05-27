import { SurveyModuleDef } from './types';

export const SURVEY_MODULES: SurveyModuleDef[] = [
  {
    id: 'M1',
    title: 'Módulo 1: Entorno General y Conexión',
    items: [
      {
        id: '1.1',
        moduleId: 'M1',
        title: 'Fachada del Inmueble',
        purpose: 'Identificar el tipo de arquitectura, accesos para materiales y estado general de la infraestructura.',
        isMandatory: true,
      },
      {
        id: '1.2',
        moduleId: 'M1',
        title: 'Transformador Asociado',
        purpose: 'Capturar la placa técnica y obligatoriamente el número de identificación visible para el trámite de conexión ante el Operador de Red.',
        isMandatory: true,
      },
      {
        id: '1.3',
        moduleId: 'M1',
        title: 'Frontera Comercial',
        purpose: 'Foto nítida del medidor actual, displays, serial y sellos de seguridad.',
        isMandatory: true,
      },
      {
        id: '1.4',
        moduleId: 'M1',
        title: 'Protección Frontera Comercial',
        purpose: 'Verificar el estado y capacidad del breaker/fusible principal junto al medidor.',
        isMandatory: true,
      },
      {
        id: '1.5',
        moduleId: 'M1',
        title: 'Cable de Salida',
        purpose: 'Identificar el calibre visual, tipo de conductor (cobre/aluminio) y estado de la canalización de la acometida principal.',
        isMandatory: true,
      },
      {
        id: '1.6',
        moduleId: 'M1',
        title: 'Puesta a Tierra Comercial',
        purpose: 'Evidenciar la existencia y estado de la varilla de puesta a tierra y el conector en la zona del medidor.',
        isMandatory: true,
      }
    ]
  },
  {
    id: 'M2',
    title: 'Módulo 2: Sistema Eléctrico Interno',
    items: [
      {
        id: '2.1',
        moduleId: 'M2',
        title: 'Tablero Eléctrico Principal (Abierto)',
        purpose: 'Visualizar el totalizador interno, barras de distribución, espacio disponible para el nuevo breaker solar y tuberías.',
        isMandatory: true,
      },
      {
        id: '2.2',
        moduleId: 'M2',
        title: 'Tensión en Punto de Conexión',
        purpose: 'Foto del multímetro midiendo los voltajes reales del sitio (Fase-Fase, Fase-Neutro, Fase-Tierra) para validación del inversor.',
        isMandatory: true,
      },
      {
        id: '2.3',
        moduleId: 'M2',
        title: 'Factura de Electricidad',
        purpose: 'Captura completa de alta resolución para extraer el CUAS, consumos históricos de 12 meses y estrato/tarifa.',
        isMandatory: true,
      }
    ]
  },
  {
    id: 'M3',
    title: 'Módulo 3: Análisis de Cubierta',
    items: [
      {
        id: '3.1',
        moduleId: 'M3',
        title: 'Cubierta - Vista Superior',
        purpose: 'Determinar visualmente las rutas de tuberías, tejas rotas, sombras cercanas, obstáculos y accesos seguros al techo.',
        isMandatory: true,
      },
      {
        id: '3.2',
        moduleId: 'M3',
        title: 'Cubierta - Vista Interior',
        purpose: 'Observar el tipo de estructura que soporta el techo (correas, madera, cerchas) para diseñar el tipo de anclaje solar.',
        isMandatory: true,
      },
      {
        id: '3.3',
        moduleId: 'M3',
        title: 'Medición Ejes de Soporte',
        purpose: 'Foto con flexómetro visible que muestre la distancia exacta entre las correas/perfiles del techo.',
        isMandatory: true,
      }
    ]
  },
  {
    id: 'M4',
    title: 'Módulo 4: Zona del Inversor',
    items: [
      {
        id: '4.1',
        moduleId: 'M4',
        title: 'Pared para el Inversor',
        purpose: 'Evaluar el material (concreto, ladrillo, drywall) para verificar resistencia al peso y condiciones de ventilación.',
        isMandatory: true,
      },
      {
        id: '4.2',
        moduleId: 'M4',
        title: 'Mediciones del Espacio',
        purpose: 'Validar con flexómetro que se cumplan las distancias mínimas de despeje exigidas por el fabricante para disipación de calor.',
        isMandatory: true,
      }
    ]
  },
  {
    id: 'M5',
    title: 'Módulo 5: Topografía y Dron',
    items: [
      {
        id: '5.1',
        moduleId: 'M5',
        title: 'Foto de Dron (Vista Cenital)',
        purpose: 'Análisis macro de distancias, áreas útiles de cubierta y diseño del layout general del proyecto.',
        isMandatory: false,
      },
      {
        id: '5.2',
        moduleId: 'M5',
        title: 'Foto en Suelo de Referencia',
        purpose: 'Foto a nivel de suelo capturando un elemento medido (ej. 5m exactos) visible desde el dron para escalado de píxeles a metros.',
        isMandatory: false,
      }
    ]
  }
];
