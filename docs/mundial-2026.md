# Mundial 2026

## Objetivo

Crear un hub especial para la cobertura del Mundial 2026 dentro de Jujuy Conecta.

## URLs

- /mundial-2026
- /mundial-2026/fixture

## Estado actual

MVP funcional desplegado en entorno de desarrollo.

## Componentes implementados

### Hub principal

- MundialTopBanner
- MundialHero
- MundialTodayMatches
- MundialArgentinaMatch
- MundialGroups
- MundialBracket
- MundialNews

### Fixture

- FixtureHero
- FixtureArgentina
- FixtureDaySection
- FixtureMatchCard

## Funcionalidades implementadas

- Hub mundialista independiente.
- Categoría mundial-2026 creada en Supabase.
- Noticias filtradas por categoría.
- Visualización de noticias con imagen destacada.
- Banner global debajo del Header.
- Sección de próximos partidos destacados.
- Tabla de grupos.
- Llave eliminatoria.
- Cobertura especial de Argentina.
- Fixture completo del Mundial 2026.
- Agrupación automática por fecha.
- Agenda destacada de la Selección Argentina.

## Datos

- Fixture cargado localmente mediante matches.ts.
- 104 partidos del Mundial 2026.
- Sin dependencia de APIs externas.

## Decisiones tomadas

- Una única página principal para el Mundial.
- Sin APIs pagas.
- Datos mock durante la primera etapa.
- Noticias administradas desde Supabase.
- Las noticias mundialistas pueden aparecer también en Home.
- Se prioriza visibilidad y experiencia visual antes que automatización.
- El fixture se mantiene inicialmente mediante datos estáticos.

## Próximos pasos

### Prioridad alta

- Mejorar navegación del fixture.
- Agregar bloque Mundial 2026 en Home.
- Mejorar Hero con imagen mundialista.
- Destacar próximos partidos relevantes.

### Prioridad media

- Selector de fechas en fixture.
- Filtros por grupo.
- Banderas reales para selecciones.
- SEO específico para Mundial 2026.

### Futuro

- Resultados reales.
- Tablas automáticas.
- Estadísticas de selecciones.
- Integración con APIs gratuitas si aportan valor.