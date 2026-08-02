"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import cooperativesElbow from "@/public/images/clusterizacion/cooperativas-metodo-codo.png";
import cooperativesSilhouette from "@/public/images/clusterizacion/cooperativas-silhouette.png";
import otherInstitutionsElbow from "@/public/images/clusterizacion/otras-instituciones-metodo-codo.png";
import otherInstitutionsSilhouette from "@/public/images/clusterizacion/otras-instituciones-silhouette.png";

const sourceCode = String.raw`
  ##Paquetes

  # install.packages(c("readxl","tibble","dplyr","tidyr","cluster","psych","stringr")) ###Instalar librerias

  ##Librerías
  library(readxl)
  library(tibble)
  library(dplyr)
  library(tidyr)
  library(cluster)
  library(psych)
  library(stringr)

  ##Cargar datos
  ruta_archivo = "C:\\Users\\usuario\\Desktop\\TFG\\Datos\\Base de datos-Para Panel.xlsx"
  data_total   = read_excel(path = ruta_archivo, sheet = "Data")

  ##Filtros base
  entidades_filtrar = c("BAC SAN JOSE","CATHAY","GRUPO MUTUAL","MUCAP","SCOTIABANK","POPULAR")
  data_total$Periodo = as.Date(data_total$Periodo)

  # Filtra por entidades y año (ajusta si deseas más)
  data_filtrada <- data_total[
    data_total$Entidad %in% entidades_filtrar &
      format(data_total$Periodo, "%Y") %in% c("2024"),
  ]

  ##Indicador  Código (I1–I15) 
  #Nota: Aca se el asigna a cada indicar de la SUGEF un codigo de indicar, para fines de simplicidad 
  data_filtrada <- data_filtrada %>%
    mutate(
      Indicador = str_squish(Indicador),
      Indicador = case_when(
        Indicador == "Activo Productivo / Activo total" ~ "I1",
        Indicador == "Activo Productivo de Intermediación Financiera / Activo Productivo" ~ "I2",
        Indicador == "Activo Productivo de Intermediación Financiera/ Pasivo con Costo  1" ~ "I3",
        Indicador == "Captaciones a plazo con el público / Pasivo con costo" ~ "I4",
        Indicador == "Cartera al día y con atraso de hasta 90 días (excepto cobro judicial) / Activo Productivo" ~ "I5",
        Indicador == "Cartera al día y con atraso hasta 90 días/Cartera total" ~ "I6",
        Indicador %in% c("Compromiso patrimonial","Solvencia y Capitalización","Solvencia y Capitalizacion") ~ "I7",
        Indicador == "Estimaciones sobre cartera de créditos / Cartera con atraso mayor a 90 días y cobro judicial" ~ "I8",
        Indicador == "Inversiones en títulos valores / Activo Productivo de Intermediación Financiera" ~ "I9",
        Indicador == "Morosidad mayor a 90 días y cobro judicial / Cartera Directa" ~ "I10",
        Indicador == "Obligaciones con entidades financieras del exterior / Pasivo con costo" ~ "I11",
        Indicador == "Obligaciones con entidades financieras del país / Pasivo con costo" ~ "I12",
        Indicador == "Pasivo con costo / Pasivo Total" ~ "I13",
        Indicador == "Rentabilidad nominal sobre Patrimonio Promedio" ~ "I14",
        Indicador == "Utilidad Operacional Bruta / Gastos de Administración  1" ~ "I15",
        TRUE ~ Indicador
      )
    )

  ##Indicadores a usar en la clusterizacion (k-means)
  #Nota: estos se selecionaron dado temas de liquidez, mora, riesgo etc.
  indicadores_seleccionados <- c("I8","I14","I3","I10","I15")

  ## Media geométrica por Entidad-Indicador
  #Nota: se aplica una media geometrica de los datos por indicador, se usa esta media por su solidez matematica 
  media_geom <- function(x) {
    x <- suppressWarnings(as.numeric(x))
    x <- x[is.finite(x) & x > 0]    # evita log de no-positivos
    if (length(x) == 0) return(NA_real_)
    exp(mean(log(x)))}

  media_geometrica <- data_filtrada %>%
    group_by(Entidad, Indicador) %>%
    summarise(Media_Geometrica = media_geom(Valor), .groups = "drop") %>%
    filter(Indicador %in% indicadores_seleccionados)

  ##k-means (una fila por Entidad)
  df_wide <- media_geometrica %>%
    pivot_wider(names_from = Indicador, values_from = Media_Geometrica)

  if (!"Entidad" %in% names(df_wide)) {
    stop("No hay columna 'Entidad' después del pivot_wider. Verifica datos/indicadores.")
  }

  # Matriz numérica con Entidad 
  mat <- df_wide %>%
    select(Entidad, all_of(indicadores_seleccionados)) %>%  # asegura solo indicadores deseados
    column_to_rownames("Entidad") %>%
    mutate(across(everything(), as.numeric)) %>%
    as.data.frame()

  if (nrow(mat) < 2) stop("Se necesitan al menos 2 entidades para ejecutar k-means/silhouette.")

  # Imputar NAs por media de columna
  mat[is.na(mat)] <- apply(mat, 2, function(x) mean(x, na.rm = TRUE))[col(mat)][is.na(mat)]

  # Eliminar columnas constantes (sd = 0) que rompen el escalado
  sds <- apply(mat, 2, sd, na.rm = TRUE)
  const_cols <- names(sds)[which(!is.finite(sds) | sds == 0)]
  if (length(const_cols) > 0) {
    message("Eliminando columnas sin varianza: ", paste(const_cols, collapse = ", "))
    mat <- mat[, setdiff(colnames(mat), const_cols), drop = FALSE]
  }

  if (ncol(mat) == 0) stop("No quedan indicadores con varianza para clusterizar.")

  # Estandarizar
  mat_num    <- as.matrix(mat)
  mat_scaled <- scale(mat_num)

  if (!all(is.finite(mat_scaled))) {
    stop("Hay NA/NaN/Inf después de escalar. Revisa datos o columnas sin varianza.")
  }

  # Filas útiles y distintas (para limitar k)
  n_rows <- nrow(mat_scaled)
  n_dist <- nrow(unique(as.data.frame(mat_scaled)))
  if (is.null(n_rows) || n_rows < 1) stop("mat_scaled no tiene filas válidas.")

  ##MÉTODO DEL CODO
  set.seed(123)
  max_k <- min(10, n_rows, n_dist)   # tope seguro
  wss <- sapply(1:max_k, function(k){
    tryCatch(
      kmeans(mat_scaled, centers = k, nstart = 25)$tot.withinss,
      error = function(e) NA_real_
    )
  })
  if (all(is.na(wss))) stop("No fue posible calcular WSS para ningún k. Verifica los datos.")

  plot(1:max_k, wss, type = "b", pch = 19,
      xlab = "Número de clusters (k)", ylab = "WSS",
      main = "Método del codo")

  ## MÉTODO SILHOUETTE 
  if (n_rows >= 3 && max_k >= 2) {
    ks_sil <- 2:max_k
    sil_width <- sapply(ks_sil, function(k){
      tryCatch({
        km <- kmeans(mat_scaled, centers = k, nstart = 25)
        mean(silhouette(km$cluster, dist(mat_scaled))[, 3])
      }, error = function(e) NA_real_)
    })
    if (all(is.na(sil_width))) {
      message("No se pudo calcular silhouette para los k probados.")
    } else {
      plot(ks_sil, sil_width, type = "b", pch = 19,
          xlab = "k", ylab = "Silhouette promedio",
          main = "Método Silhouette")
    }
  } else {
    message("Silhouette requiere al menos 3 entidades y k >= 2.")
  }

  #Nota: se incorporan los 2 metodos para veridicar la cnatidad de clusteres


  ##Otros paquetes
  suppressPackageStartupMessages({
    library(dplyr)
    library(tibble)
    library(psych)   # para usar describeBy
  })

  ## Selección k óptimo 
  set.seed(123)

  usar_codo = TRUE   # si quiero usar silhouette poner falso


  if (usar_codo) {
    k_opt =  3   # valor elegido según el gráfico del codo
  } else if (exists("sil_width") && any(is.finite(sil_width))) {
    k_opt = ks_sil[ which.max(sil_width) ]   # mejor k por silhouette
  } else {
    k_opt = min(3, if (exists("max_k")) max_k else 3)  # fallback seguro
  }

  ## Ajuste final del modelo K-means 
  # mat_scaled: matriz/df numérica estandarizada (filas = Entidad)
  stopifnot(exists("mat_scaled"))

  km_fit <- kmeans(
    x         = mat_scaled,
    centers   = k_opt,
    nstart    = 50,
    iter.max  = 100)

  ## RESULTADO PRINCIPAL: Entidad - Cluster 
  # Resolver nombres de entidad de forma robusta
  entidades <- rownames(mat_scaled)
  if (is.null(entidades) || any(is.na(entidades)) || any(entidades == "")) {
    stopifnot(exists("df_wide"), "Entidad" %in% names(df_wide))
    entidades <- df_wide$Entidad}

  cluster_assignments <- tibble(
    Entidad = entidades,
    Cluster = factor(km_fit$cluster, levels = sort(unique(km_fit$cluster))))

  ## Tabla con indicadores + cluster 
  stopifnot(exists("df_wide"), "Entidad" %in% names(df_wide))

  df_clusters <- df_wide %>%
    select(Entidad, everything()) %>%
    left_join(cluster_assignments, by = "Entidad") %>%
    arrange(Cluster, Entidad)

  print(df_clusters, n = Inf)

  ##Conteo por cluster 
  conteo_clusters = df_clusters %>% count(Cluster, name = "Num_Entidades")
  print(conteo_clusters)

  ## Perfil promedio por cluster 
  cluster_profile <- df_clusters %>%
    select(-Entidad) %>%
    group_by(Cluster) %>%
    summarise(
      across(where(is.numeric), mean, na.rm = TRUE, .names = "avg_{.col}"),
      .groups = "drop"
    )

  print(cluster_profile, n = Inf)

  ## (Opcional) Descriptivos por cluster en datos escalados 
  mat_scaled_m <- if (is.data.frame(mat_scaled)) as.matrix(mat_scaled) else mat_scaled
  desc_clusters <- describeBy(mat_scaled_m, group = km_fit$cluster, mat = TRUE)
  print(head(desc_clusters, 10))
`;

const contents = [
  { id: "objective", label: "Objetivo y metodología" },
  { id: "portfolio-segmentation", label: "Segmentación de la cartera" },
  { id: "financial-indicators", label: "Indicadores financieros" },
  { id: "cluster-selection", label: "Selección de clústeres" },
  { id: "cluster-a", label: "Bancos y otras instituciones" },
  { id: "cluster-b", label: "Cooperativas" },
  { id: "conclusions", label: "Conclusiones" },
  { id: "project-reference", label: "Referencia y autoría" },
  { id: "source-code", label: "Código fuente" },
];

const portfolioSegmentationRows = [
  ["Cathay", "Coocique"],
  ["Grupo Mutual", "Coopeande"],
  ["MUCAP", "Coopecaja"],
  ["Popular", "Coopemep"],
  ["Scotiabank", "Coopenae"],
  ["BAC San José", "Coopealianza"],
];

const indicatorRows = [
  ["Activo Productivo de Intermediación Financiera / Pasivo con Costo 1", "I3"],
  [
    "Estimaciones sobre cartera de créditos / Cartera con atraso mayor a 90 días y cobro judicial",
    "I8",
  ],
  ["Morosidad mayor a 90 días y cobro judicial / Cartera Directa", "I10"],
  ["Rentabilidad nominal sobre Patrimonio Promedio", "I14"],
  ["Utilidad Operacional Bruta / Gastos de Administración 1", "I15"],
];

const clusterARows = [
  ["CATHAY", "2.30", "6.09", "1.67", "0.900", "1.920", "1"],
  ["GRUPO MUTUAL", "2.95", "10.10", "1.21", "0.921", "0.865", "1"],
  ["MUCAP", "2.81", "4.21", "1.04", "0.901", "0.614", "1"],
  ["POPULAR", "2.20", "1.87", "1.24", "1.260", "1.660", "2"],
  ["SCOTIABANK", "1.31", "2.59", "1.28", "0.994", "2.050", "2"],
  ["BAC SAN JOSÉ", "1.24", "12.80", "1.91", "1.080", "3.480", "3"],
];

const clusterBRows = [
  ["COOCIQUE", "2.71", "2.97", "1.27", "1.12", "1.49", "1"],
  ["COOPEANDE", "2.89", "2.71", "1.43", "1.21", "1.38", "1"],
  ["COOPECAJA", "1.99", "6.01", "1.53", "1.46", "3.82", "2"],
  ["COOPEMEP", "1.67", "3.90", "1.47", "1.32", "1.89", "2"],
  ["COOPENAE", "2.13", "5.61", "1.62", "1.20", "1.92", "2"],
  ["COOPEALIANZA", "2.47", "7.29", "2.54", "1.25", "5.68", "3"],
];

export default function ClusterizationArticle() {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("No fue posible copiar el código:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#020817] text-slate-200">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[150px]" />
        <div className="absolute bottom-[-300px] right-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 sm:px-8 lg:px-10">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 transition hover:text-indigo-200"
        >
          <span aria-hidden="true">←</span>
          Volver a proyectos
        </Link>

        <header className="border-b border-white/10 pb-10 pt-12">
          <section className="mx-auto mb-6 max-w-6x1 px-1 pt-8 sm:px-1">
            <Link
              href="/projects/modelo02"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/[0.08] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200 transition-all duration-300 hover:border-indigo-400/60 hover:bg-indigo-500/[0.15] hover:text-white"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              Volver
            </Link>
          </section>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Aprendizaje no supervisado
            </span>
            <span className="text-sm text-slate-500">Artículo técnico</span>
          </div>

          <h1 className="max-w-5xl text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Clusterización, perfiles de riesgo y desempeño
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">
            Clasificación de las entidades que conforman la cartera institucional
            del BANHVI mediante K-means, con el propósito de identificar perfiles
            relativos de riesgo, solidez financiera y desempeño.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span>
              Autores:{" "}
              <strong className="font-medium text-slate-300">
                Henry Fabian Alvarado Vargas, José Andrés Castillo Azofeifa y
                Mario Alejandro Paniagua Barrantes
              </strong>
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>Universidad de Costa Rica</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>2026</span>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="min-w-0">
            <section
              id="objective"
              className="scroll-mt-28 border-b border-white/10 pb-12"
            >
              <ArticleTitle number="01">Objetivo y metodología</ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El análisis tiene como objetivo clasificar las entidades que
                  conforman la cartera institucional del BANHVI según sus
                  características financieras, con el propósito de identificar
                  perfiles relativos de riesgo y desempeño.
                </p>

                <p>
                  La segmentación se realizó mediante el algoritmo de aprendizaje
                  no supervisado K-means, utilizando indicadores financieros
                  empleados por la Superintendencia General de Entidades
                  Financieras (SUGEF) para evaluar la liquidez, el riesgo
                  crediticio, la rentabilidad y la eficiencia operativa de las
                  entidades del sistema financiero costarricense.
                </p>

                <p>
                  Para estimar el modelo se utilizaron datos históricos de 2024.
                  Los valores anuales fueron tratados mediante una media
                  geométrica, con el propósito de reducir el efecto de las
                  variaciones estacionales observadas durante el período.
                </p>

                <blockquote className="my-8 border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  Los cinco indicadores seleccionados representan dimensiones
                  centrales de la solidez financiera: intermediación, cobertura
                  crediticia, morosidad, rentabilidad y eficiencia operativa.
                </blockquote>
              </div>
            </section>

            <section
              id="portfolio-segmentation"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="02">
                Segmentación inicial de la cartera
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Como primera etapa, la cartera se dividió en dos grupos de
                acuerdo con la naturaleza operativa de las entidades.
              </p>

              <DataTable
                title="Tabla 1. Segregación de la cartera por clúster"
                headers={["Clúster A — Bancos y otros", "Clúster B — Cooperativas"]}
                rows={portfolioSegmentationRows}
                caption="Fuente: elaboración propia con datos del Informe de Gestión FONAVI (2025)."
              />
            </section>

            <section
              id="financial-indicators"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="03">
                Indicadores financieros analizados
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Los indicadores seleccionados buscan representar las principales
                dimensiones de la solidez financiera de las entidades.
              </p>

              <DataTable
                title="Tabla 2. Códigos y denominaciones de los indicadores financieros"
                headers={["Indicador", "Código"]}
                rows={indicatorRows}
                caption="Fuente: elaboración propia con datos de la SUGEF (Costa Rica)."
              />
            </section>

            <section
              id="cluster-selection"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="04">
                Selección del número de subclústeres
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  La selección de tres subclústeres para cada segmento se
                  fundamentó en la aplicación conjunta del método del codo y el
                  coeficiente de silueta o silhouette.
                </p>

                <p>
                  El método del codo evalúa la reducción de la variación interna
                  conforme aumenta el número de grupos, mientras que el
                  coeficiente de silueta permite valorar qué tan bien separadas y
                  cohesionadas se encuentran las observaciones dentro de cada
                  solución.
                </p>
              </div>

              <div className="mt-10 space-y-12">
                <FigureGroup
                  title="Figura 1. Método del codo y Silhouette para Cooperativas"
                  figures={[
                    {
                      image: cooperativesElbow,
                      alt: "Método del codo aplicado al segmento de cooperativas",
                      label: "Método del codo",
                    },
                    {
                      image: cooperativesSilhouette,
                      alt: "Método Silhouette aplicado al segmento de cooperativas",
                      label: "Coeficiente Silhouette",
                    },
                  ]}
                  source="Fuente: elaboración propia con datos de la SUGEF (Costa Rica)."
                />

                <FigureGroup
                  title="Anexo 1. Método del codo y Silhouette para Otras Instituciones"
                  figures={[
                    {
                      image: otherInstitutionsElbow,
                      alt: "Método del codo aplicado al segmento de bancos y otras instituciones",
                      label: "Método del codo",
                    },
                    {
                      image: otherInstitutionsSilhouette,
                      alt: "Método Silhouette aplicado al segmento de bancos y otras instituciones",
                      label: "Coeficiente Silhouette",
                    },
                  ]}
                  source="Fuente: elaboración propia con datos de la SUGEF (Costa Rica)."
                />
              </div>
            </section>

            <section
              id="cluster-a"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="05">
                Perfiles de riesgo y desempeño: Clúster A
              </ArticleTitle>

              <DataTable
                title="Tabla 3. Clusterización de Bancos y Otras Instituciones"
                headers={["Entidad", "I10", "I14", "I15", "I3", "I8", "Clúster"]}
                rows={clusterARows}
                caption="Fuente: elaboración propia con datos de la SUGEF (Costa Rica)."
              />

              <div className="mt-10 space-y-8">
                <RiskProfileCard
                  cluster="Subclúster 1"
                  entities="Cathay, Grupo Mutual y MUCAP"
                  risk="Alto riesgo relativo"
                  tone="high"
                >
                  <p>
                    Las entidades presentan una rentabilidad relativamente
                    favorable y un nivel moderado de morosidad. Su desempeño
                    evidencia una capacidad adecuada para generar utilidades a
                    partir del patrimonio y utilizar eficientemente sus recursos.
                  </p>
                  <p>
                    El principal elemento de vulnerabilidad corresponde a la baja
                    cobertura de la cartera riesgosa, representada por el
                    indicador I8. Esto limita su capacidad para absorber aumentos
                    inesperados de la morosidad o pérdidas crediticias durante
                    escenarios económicos adversos.
                  </p>
                  <p>
                    Aunque el grupo mantiene un equilibrio razonable entre
                    rentabilidad y riesgo, una parte importante de su fortaleza
                    depende de que se mantenga un entorno crediticio favorable.
                    Por esta razón, se clasifica como el subclúster de mayor
                    riesgo relativo entre los bancos y otras entidades.
                  </p>
                </RiskProfileCard>

                <RiskProfileCard
                  cluster="Subclúster 2"
                  entities="Banco Popular y Scotiabank"
                  risk="Riesgo relativo medio"
                  tone="medium"
                >
                  <p>
                    Este grupo presenta un perfil más conservador. Su rentabilidad
                    sobre el patrimonio es inferior a la del primer subclúster,
                    pero mantiene una menor morosidad promedio y una cobertura
                    crediticia más favorable.
                  </p>
                  <p>
                    Los resultados reflejan una preferencia por la estabilidad
                    financiera frente a la maximización del retorno. Las entidades
                    parecen mantener políticas crediticias más prudentes y
                    estructuras patrimoniales orientadas a limitar la exposición a
                    pérdidas.
                  </p>
                  <p>
                    Debido a que su mayor estabilidad se acompaña de una
                    rentabilidad limitada, el grupo se clasifica con un nivel
                    medio de riesgo relativo.
                  </p>
                </RiskProfileCard>

                <RiskProfileCard
                  cluster="Subclúster 3"
                  entities="BAC San José"
                  risk="Bajo riesgo relativo y alto retorno"
                  tone="low"
                >
                  <p>
                    BAC San José constituye un clúster individual debido a que
                    presenta indicadores significativamente distintos a los de
                    sus pares. La entidad puede considerarse un outlier
                    estructural dentro del segmento bancario.
                  </p>

                  <BulletList
                    items={[
                      "Mayor rentabilidad sobre el patrimonio: I14 de 12,80.",
                      "Menor morosidad del segmento: I10 de 1,24.",
                      "Elevada cobertura de la cartera riesgosa: I8 de 3,48.",
                      "Mayor eficiencia operativa: I15 de 1,91.",
                    ]}
                  />

                  <p>
                    La combinación de rentabilidad elevada, baja morosidad,
                    eficiencia operativa y cobertura crediticia favorable ubica
                    a BAC San José en una posición de bajo riesgo relativo y alto
                    retorno.
                  </p>
                </RiskProfileCard>
              </div>
            </section>

            <section
              id="cluster-b"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="06">
                Perfiles de riesgo y desempeño: Clúster B
              </ArticleTitle>

              <DataTable
                title="Tabla 4. Clusterización de Cooperativas"
                headers={["Entidad", "I10", "I14", "I15", "I3", "I8", "Clúster"]}
                rows={clusterBRows}
                caption="Fuente: elaboración propia con datos de la SUGEF (Costa Rica)."
              />

              <div className="mt-10 space-y-8">
                <RiskProfileCard
                  cluster="Subclúster 1"
                  entities="Coocique y Coopeande"
                  risk="Alto riesgo relativo"
                  tone="high"
                >
                  <p>
                    Este grupo presenta la morosidad promedio más elevada y la
                    rentabilidad sobre el patrimonio más baja entre las
                    cooperativas analizadas. Aunque mantiene una eficiencia
                    operativa razonable, esta es inferior a la registrada por los
                    otros subclústeres.
                  </p>
                  <p>
                    La cobertura de la cartera riesgosa también se encuentra en
                    niveles bajos. La combinación de una morosidad alta, una
                    cobertura crediticia limitada y una rentabilidad reducida
                    incrementa la vulnerabilidad de estas entidades ante un
                    deterioro de la economía.
                  </p>
                  <p>
                    En un escenario de pérdidas inesperadas, las utilidades
                    podrían resultar insuficientes para absorber completamente
                    los efectos de un incremento de la morosidad. Por ello, este
                    grupo representa el subclúster de mayor riesgo relativo dentro
                    de las cooperativas.
                  </p>
                </RiskProfileCard>

                <RiskProfileCard
                  cluster="Subclúster 2"
                  entities="Coopecaja, Coopemep y Coopenae"
                  risk="Riesgo relativo medio"
                  tone="medium"
                >
                  <p>
                    Las entidades de este grupo presentan carteras relativamente
                    más sanas, con una morosidad promedio inferior a la del primer
                    subclúster. Además, registran una rentabilidad, eficiencia
                    operativa y cobertura crediticia moderadas.
                  </p>
                  <p>
                    El grupo muestra un balance más favorable entre generación de
                    retornos y control del riesgo. Su cobertura promedio permite
                    reducir la vulnerabilidad ante eventos adversos, aunque su
                    capacidad de absorción de pérdidas todavía es intermedia.
                  </p>
                  <p>
                    Por esta razón, el subclúster se clasifica con un nivel medio
                    de riesgo relativo, al encontrarse en una mejor posición que
                    el primer grupo, pero sin alcanzar la fortaleza financiera de
                    Coopealianza.
                  </p>
                </RiskProfileCard>

                <RiskProfileCard
                  cluster="Subclúster 3"
                  entities="Coopealianza"
                  risk="Perfil más robusto"
                  tone="low"
                >
                  <p>
                    Coopealianza constituye un clúster individual debido a que sus
                    indicadores se encuentran alejados de los valores observados
                    en las demás cooperativas.
                  </p>

                  <BulletList
                    items={[
                      "Mayor rentabilidad entre las cooperativas: I14 de 7,29.",
                      "Mayor eficiencia operativa: I15 de 2,54.",
                      "Cobertura crediticia más elevada: I8 de 5,68.",
                      "Morosidad intermedia: I10 de 2,47.",
                    ]}
                  />

                  <p>
                    Aunque su morosidad no es la más baja del segmento, la
                    elevada cobertura crediticia, la rentabilidad y el margen
                    operativo proporcionan una mayor capacidad para enfrentar
                    pérdidas o escenarios adversos.
                  </p>
                  <p>
                    Coopealianza se posiciona como el subclúster más estable y
                    robusto entre las cooperativas, con una estructura de negocio
                    eficiente y un perfil prudencial comparativamente maduro.
                  </p>
                </RiskProfileCard>
              </div>
            </section>

            <section
              id="conclusions"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="07">Conclusiones</ArticleTitle>

              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <BulletList
                  items={[
                    "La aplicación de K-means permitió identificar diferencias relevantes en los perfiles de riesgo y desempeño de las entidades de la cartera institucional del BANHVI.",
                    "Los indicadores de morosidad (I10), cobertura crediticia (I8) y rentabilidad (I14) resultaron determinantes para distinguir los perfiles financieros.",
                    "Cathay, Grupo Mutual y MUCAP presentan la mayor vulnerabilidad relativa entre bancos y otras entidades, principalmente por su menor cobertura de cartera.",
                    "Banco Popular y Scotiabank mantienen una estrategia comparativamente conservadora, caracterizada por mayor estabilidad y niveles reducidos de rentabilidad.",
                    "BAC San José combina la mayor rentabilidad, la menor morosidad y una cobertura elevada, por lo que presenta el mejor desempeño relativo de su segmento.",
                    "Coocique y Coopeande presentan el perfil más vulnerable entre las cooperativas por su morosidad elevada, rentabilidad reducida y baja cobertura crediticia.",
                    "Coopecaja, Coopemep y Coopenae mantienen una posición intermedia, con mejores condiciones de cartera y cobertura, aunque con capacidad moderada para absorber choques.",
                    "Coopealianza presenta el perfil más robusto entre las cooperativas debido a su cobertura crediticia, rentabilidad y eficiencia operativa.",
                    "Los clústeres individuales de BAC San José y Coopealianza evidencian outliers estructurales y demuestran la capacidad del modelo para detectar comportamientos diferenciados.",
                    "Los resultados constituyen una herramienta complementaria para orientar el seguimiento de la cartera, priorizar entidades y definir análisis específicos de riesgo.",
                  ]}
                />
              </div>
            </section>

            <section
              id="project-reference"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="08">
                Referencia
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El presente análisis forma parte del Trabajo Final de
                  Investigación Aplicada titulado{" "}
                  <em className="text-slate-200">
                    Evaluación de la solidez financiera de los clientes de la
                    cartera institucional del BANHVI dentro del sistema
                    financiero costarricense y sensibilización de la cartera ante
                    escenarios macroeconómicos adversos
                  </em>
                  , desarrollado para optar por el grado y título de Maestría
                  Profesional en Riesgo y Finanzas de la Universidad de Costa
                  Rica.
                </p>

                <p>El Trabajo Final de Graduación fue elaborado conjuntamente por:</p>

                <BulletList
                  items={[
                    "Henry Fabian Alvarado Vargas.",
                    "José Andrés Castillo Azofeifa.",
                    "Mario Alejandro Paniagua Barrantes.",
                  ]}
                />

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                  <p className="font-semibold text-white">Universidad de Costa Rica</p>
                  <p>Sistema de Estudios de Posgrado</p>
                  <p>Programa de Posgrado en Economía</p>
                  <p>Ciudad Universitaria Rodrigo Facio, Costa Rica</p>
                  <p>2026</p>
                </div>

                <h3 className="pt-4 text-xl font-semibold text-white">
                  Descripción del proyecto
                </h3>

                <p>
                  La investigación tuvo como objetivo evaluar la solidez
                  financiera de las instituciones que conforman la cartera
                  institucional del Banco Hipotecario de la Vivienda, BANHVI,
                  así como analizar la sensibilidad de sus principales
                  indicadores financieros ante cambios y escenarios
                  macroeconómicos adversos.
                </p>

                <div className="rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] p-6 text-sm leading-7 text-slate-300">
                  Alvarado Vargas, H. F., Castillo Azofeifa, J. A., &amp;
                  Paniagua Barrantes, M. A. (2026).{" "}
                  <em>
                    Evaluación de la solidez financiera de los clientes de la
                    cartera institucional del BANHVI dentro del sistema
                    financiero costarricense y sensibilización de la cartera ante
                    escenarios macroeconómicos adversos
                  </em>{" "}
                  [Trabajo final de investigación aplicada de maestría,
                  Universidad de Costa Rica].
                </div>
              </div>
            </section>

            <section id="source-code" className="scroll-mt-28 pt-12">
              <ArticleTitle number="09">Código fuente</ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                El apartado conserva la misma estructura del artículo anterior
                para que pueda incorporar posteriormente el script completo del
                análisis de clusterización.
              </p>

              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#030711]/90 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    </div>
                    <span className="font-mono text-xs text-slate-500 sm:text-sm">
                      clusterizacion_banhvi.R
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={copyCode}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-indigo-400/30 hover:bg-indigo-400/10 hover:text-indigo-200"
                  >
                    {copied ? "Copiado" : "Copiar código"}
                  </button>
                </div>

                <div className="code-scrollbar max-h-[520px] overflow-auto">
                  <pre className="min-w-max p-5 font-mono text-[13px] leading-7 text-slate-300 sm:p-7 sm:text-sm">
                    <code>{sourceCode.trim()}</code>
                  </pre>
                </div>

                <div className="border-t border-white/10 bg-white/[0.02] px-5 py-3 text-xs text-slate-600">
                  Desplácese dentro del recuadro para consultar el script completo.
                </div>
              </div>
            </section>
          </article>

          <aside className="order-first lg:order-last">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 backdrop-blur-lg">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Contenido
                </p>

                <nav aria-label="Contenido del artículo">
                  <ol className="space-y-1">
                    {contents.map((item, index) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="group flex items-start gap-3 rounded-lg px-2 py-2 text-sm text-slate-400 transition hover:bg-white/[0.04] hover:text-indigo-300"
                        >
                          <span className="font-mono text-xs text-slate-600 transition group-hover:text-indigo-400">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span>{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              <div className="mt-5 rounded-2xl border border-indigo-400/10 bg-indigo-400/[0.04] p-5">
                <p className="text-sm font-semibold text-indigo-200">
                  Tecnologías y métodos
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["R", "K-means", "Silhouette", "SUGEF", "Análisis de riesgo"].map(
                    (technology) => (
                      <span
                        key={technology}
                        className="rounded-full border border-white/10 bg-[#0c1729] px-3 py-1.5 text-xs text-slate-300"
                      >
                        {technology}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

type ArticleTitleProps = {
  number: string;
  children: ReactNode;
};

function ArticleTitle({ number, children }: ArticleTitleProps) {
  return (
    <div className="mb-7 flex items-start gap-4">
      <span className="mt-1 font-mono text-sm text-indigo-400">{number}</span>
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

type DataTableProps = {
  title?: string;
  headers: string[];
  rows: string[][];
  caption?: string;
};

function DataTable({ title, headers, rows, caption }: DataTableProps) {
  return (
    <div>
      {title ? (
        <h3 className="mb-4 text-lg font-semibold leading-7 text-white">{title}</h3>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-indigo-400/[0.08]">
                {headers.map((header) => (
                  <th
                    key={header}
                    className="px-5 py-4 text-sm font-semibold text-indigo-200"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={`${row[0]}-${rowIndex}`}
                  className={
                    rowIndex !== rows.length - 1
                      ? "border-b border-white/10"
                      : undefined
                  }
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={`${cell}-${cellIndex}`}
                      className={`px-5 py-4 align-top text-sm leading-6 ${
                        cellIndex === 0
                          ? "font-medium text-slate-200"
                          : "text-slate-400"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {caption ? (
        <p className="mt-3 text-sm italic leading-6 text-slate-500">{caption}</p>
      ) : null}
    </div>
  );
}

type FigureItem = {
  image: StaticImageData;
  alt: string;
  label: string;
};

type FigureGroupProps = {
  title: string;
  figures: FigureItem[];
  source: string;
};

function FigureGroup({ title, figures, source }: FigureGroupProps) {
  return (
    <figure>
      <h3 className="mb-5 text-lg font-semibold leading-7 text-white">{title}</h3>

      <div className="grid gap-5 md:grid-cols-2">
        {figures.map((figure) => (
          <div
            key={figure.label}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#07101f] p-2 shadow-2xl shadow-black/30"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
              <Image
                src={figure.image}
                alt={figure.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="px-2 pb-1 pt-3 text-center text-sm text-slate-400">
              {figure.label}
            </p>
          </div>
        ))}
      </div>

      <figcaption className="mt-4 text-sm italic leading-6 text-slate-500">
        {source}
      </figcaption>
    </figure>
  );
}

type RiskProfileCardProps = {
  cluster: string;
  entities: string;
  risk: string;
  tone: "high" | "medium" | "low";
  children: ReactNode;
};

const riskToneClasses = {
  high: "border-red-400/20 bg-red-400/[0.045] text-red-200",
  medium: "border-amber-400/20 bg-amber-400/[0.045] text-amber-200",
  low: "border-emerald-400/20 bg-emerald-400/[0.045] text-emerald-200",
};

function RiskProfileCard({
  cluster,
  entities,
  risk,
  tone,
  children,
}: RiskProfileCardProps) {
  return (
    <div className={`rounded-2xl border p-6 sm:p-8 ${riskToneClasses[tone]}`}>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
            {cluster}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-white">{entities}</h3>
        </div>

        <span className="rounded-full border border-current/20 bg-black/10 px-3 py-1.5 text-xs font-semibold">
          {risk}
        </span>
      </div>

      <div className="space-y-5 text-[16px] leading-8 text-slate-300">
        {children}
      </div>
    </div>
  );
}

type BulletListProps = {
  items: string[];
};

function BulletList({ items }: BulletListProps) {
  return (
    <ul className="space-y-3 pl-1 text-slate-300">
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-7">
          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
