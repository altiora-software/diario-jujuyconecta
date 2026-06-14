# Especificación Técnica y de Producto: Hub Mundial 2026 - Jujuy Conecta

## 1. Objetivo
Crear un hub especial para la cobertura del Mundial 2026 dentro de **Jujuy Conecta**, combinando en un único ecosistema noticias de actualidad, fixture interactivo, seguimiento exclusivo de la Selección Argentina, tablas de grupos y fases eliminatorias.

---

## 2. Arquitectura de URLs
El especial se estructura bajo las siguientes rutas independientes y navegables:
* **Hub principal:** `/mundial-2026`
* **Fixture completo:** `/mundial-2026/fixture`

---

## 3. Estado Actual del Proyecto
* **Estado:** MVP (Producto Mínimo Viable) funcional desplegado en el entorno de desarrollo.
* **Dinamismo:** El especial ya cuenta con contenido dinámico e interactivo basado en el fixture oficial cargado localmente.

---

## 4. Componentes Implementados

### 4.1. Hub Principal (`/mundial-2026`)
* `MundialTopBanner`: Banner mundialista de visibilidad global en el sitio web.
* `FixtureHero`: Componente principal de cabecera dinámico con información contextual (reemplaza al hero anterior).
* `FixtureArgentina`: Bloque exclusivo y destacado para el seguimiento de la Selección Argentina.
* `MundialGroups`: Visualización y estructura de los grupos de la competencia.
* `MundialBracket`: Árbol visual interactivo para las fases eliminatorias (playoffs).
* `MundialNews`: Módulo de noticias automatizado y filtrado para la cita mundialista.

### 4.2. Fixture Completo (`/mundial-2026/fixture`)
* `FixtureHero`: Cabecera del fixture con datos contextuales de las jornadas.
* `FixtureArgentina`: Acceso rápido y agenda de los partidos de la selección.
* `FixtureDateSelector`: Selector y navegador por fechas/jornadas del torneo.
* `FixtureDaySection`: Contenedor organizador de partidos agrupados por día específico.
* `FixtureMatchCard`: Tarjeta individual de partido optimizada para mostrar selecciones, horarios, estadios y estados.

### 4.3. Utilidades y Helpers
* `fixture-utils`: Módulo de funciones auxiliares para cálculos de fechas, estados y cruces.
* `matches.ts`: Archivo estructurado de datos que actúa como la base informativa del torneo.

---

## 5. Funcionalidades Implementadas

### 5.1. Cobertura Editorial
* **Hub independiente:** Sección completamente aislada con identidad visual adaptada al torneo.
* **Integración con Supabase:** Creación de la categoría específica `mundial-2026` en la base de datos.
* **Filtro automatizado:** Módulo de noticias que recupera y renderiza los artículos asociados a la categoría de forma automática.
* **Multimedia:** Soporte completo para visualización de noticias con imágenes destacadas de alto impacto.
* **Estrategia Transversal:** Posibilidad de compartir y destacar noticias del mundial directamente en la Home principal de Jujuy Conecta.

### 5.2. Gestión del Fixture
* **Calendario Oficial:** Carga completa del fixture del Mundial 2026 con los **104 partidos** planificados.
* **Procesamiento de Fechas:** Agrupación automática de los encuentros según su fecha calendario.
* **Interactividad:** Navegación fluida e intuitiva entre las diferentes jornadas de la competencia.
* **Monitoreo en Tiempo Real (Mocked):** * Cálculo automático y destacado del próximo partido de la Selección Argentina.
    * Detección automática de los partidos programados para el día en curso.
    * Identificación y renderizado automático del grupo de Argentina a partir de los datos del fixture.

### 5.3. Experiencia de Usuario (UX/UI)
* **Navegación Intuitiva:** Implementación de navegación interna mediante scroll suave (*smooth scroll*) entre secciones del Hub.
* **Cabecera Inteligente:** Hero dinámico que modifica su información según el contexto temporal del torneo.
* **Engagement:** Carrusel automático que expone de forma rotativa los partidos más destacados de cada jornada.

### 5.4. Arquitectura de Datos y Dependencias
* **Fuente de Verdad Única:** Todos los componentes se alimentan exclusivamente del archivo estático y estructurado `matches.ts`.
* **Alcance de Fases Cargadas:**
    * Fase de grupos
    * Dieciseisavos de final
    * Octavos de final
    * Cuartos de final
    * Semifinales
    * Tercer puesto
    * Final
* **Eficiencia de Costos:** Cero dependencias de APIs pagas externas durante esta fase del desarrollo.

---

## 6. Decisiones de Diseño y Desarrollo Tomadas
1.  **Consistencia de Datos:** Mantener estrictamente una única fuente de verdad para el fixture (`matches.ts`) para evitar desincronizaciones.
2.  **Enfoque Visual:** Priorizar la experiencia e interfaz visual del usuario antes que la automatización de flujos de datos complejos.
3.  **Mitigación de Riesgos:** Evitar por completo la dependencia de servicios de terceros o APIs durante la primera etapa de lanzamiento.
4.  **Accesibilidad:** Asegurar la disponibilidad del fixture completo en una URL dedicada e independiente para mejorar el SEO y usabilidad.
5.  **Reutilización de Código:** Diseñar los componentes del fixture de tal forma que puedan ser embebidos y reutilizados en el Hub principal de manera modular.
6.  **Centralización de Lógica:** Agrupar toda la inteligencia del negocio mundialista dentro de utilidades reutilizables (`fixture-utils`).

---

## 7. Deuda Técnica
* Reemplazar la totalidad de componentes *legacy* heredados de estructuras previas.
* Centralizar y estandarizar los códigos FIFA oficiales de las selecciones participantes.
* Unificar la línea de diseño visual y paleta de colores entre la sección de grupos y el fixture.
* Auditar y refactorizar el SEO específico de la landing y sus componentes internos.

---

## 8. Próximos Pasos

### 🚨 Prioridad Alta
* Integrar banderas reales de los países mediante un diccionario centralizado de selecciones.
* Diseñar y desplegar un bloque exclusivo denominado "Mundial 2026" en la Home de Jujuy Conecta.
* Optimizar la navegación y los accesos rápidos de ida y vuelta entre el Hub y el Fixture.
* Destacar de forma visual y automatizada el próximo partido de Argentina en las pantallas principales.

### ⚡ Prioridad Media
* Implementar filtros avanzados de búsqueda y visualización por grupos.
* Desarrollar un buscador rápido de selecciones dentro del fixture.
* Configuración avanzada de SEO semántico específico para el ecosistema del Mundial 2026.
* Inyección de metadatos Open Graph personalizados para optimizar el comportamiento al compartir enlaces en redes sociales.

### 🔮 Futuro y Evolución del Producto
* Procesamiento de resultados reales en vivo.
* Generación automática de tablas de posiciones basadas en los resultados introducidos.
* Módulo de estadísticas detalladas por selecciones.
* Posiciones de grupos dinámicas.
* Evaluación e integración con APIs externas gratuitas siempre y cuando aporten valor real a la experiencia de usuario.