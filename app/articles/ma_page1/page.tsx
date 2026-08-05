"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const sourceCode = String.raw`
 #Paquetes
  install.packages(c("readxl", "dplyr", "plm", "lmtest", "sandwich", "tidyr", "stringr"), dependencies = TRUE)

  library(readxl)
  library(dplyr)
  library(tidyr)
  library(plm)
  library(lmtest)
  library(sandwich)
  library(stringr)

  # Datos
  ruta_archivo = file.choose()
  df       = read_excel(path = ruta_archivo, sheet = "Data")
  df_macro = read_excel(path = ruta_archivo, sheet = "Data2")

  #Limpieza de data 
  # 1 Normalizar nombres posibles de columnas macro (TPC, TBP, IPC, IMAE)
  normaliza_nombres = function(tbl) {
    nm = names(tbl)
    
    ren = c(
      TPC   = intersect(nm, c("TPC","TPCoriginal","TPC_original","tpc")),
      TBP   = intersect(nm, c("TBP","TBPoriginal","TBP_original","tbp")),
      IPC   = intersect(nm, c("IPC","IPCoriginal","IPC_original","ipc")),
      IMAE  = intersect(nm, c("IMAE","IMAEoriginal","IMAE_original","imae")))
    
    for (k in names(ren)) {
      if (length(ren[[k]]) >= 1 && !(k %in% nm)) {
        tbl = dplyr::rename(tbl, !!k := all_of(ren[[k]][1]))}} tbl}

  df_macro = normaliza_nombres(df_macro)

  # 2 Fecha y llave mensual
  if (!inherits(df$Periodo, "Date"))    df$Periodo    = as.Date(df$Periodo)
  if (!inherits(df_macro$Periodo, "Date")) df_macro$Periodo = as.Date(df_macro$Periodo)

  df       =df %>% mutate(Periodo_Mes = format(Periodo, "%Y-%m"))
  df_macro = df_macro %>% mutate(Periodo_Mes = format(Periodo, "%Y-%m"))

  # 3 Revision de duplicados por mes, colapsamos por último valor no-NA
  macro_vars = intersect(names(df_macro), c("TPC","TBP","IPC","IMAE"))
  df_macro_col = df_macro %>%
    arrange(Periodo) %>%
    group_by(Periodo_Mes) %>%
    summarise(across(all_of(macro_vars), ~ dplyr::last(na.omit(.))), .groups = "drop")

  # 4) Convertir datos en numérico (por si vinieron como texto con símbolos)
  to_num = function(x) {
    x = as.character(x)
    x = gsub("[^0-9,.-]", "", x)   # eliminar símbolos
    x = gsub(",", ".", x)          # coma -> punto
    suppressWarnings(as.numeric(x))
  }
  df_macro_col = df_macro_col %>%
    mutate(across(all_of(macro_vars), to_num))

  # Unir bases 
  df = df %>%
    left_join(df_macro_col, by = "Periodo_Mes")

  # Etiquetar entidades por grupos
  df = df %>%
    mutate(GRUPO = case_when(
      Entidad %in% c("COOCIQUE","COOPEALIANZA","COOPEANDE","COOPEMEP","COOPENAE","COOPECAJA") ~ "COOPERATIVAS",
      Entidad %in% c("BAC SAN JOSE","CATHAY","GRUPO MUTUAL","MUCAP","SCOTIABANK","POPULAR") ~ "OTROS",
      TRUE ~ NA_character_
    )) %>%
    filter(!is.na(GRUPO))

  # Renombramiento de indicadores financieros
  df_wide = df %>%
    select(Entidad, Periodo, Indicador, Valor, all_of(macro_vars), GRUPO) %>%
    mutate(Indicador = case_when(
      Indicador == "Activo Productivo / Activo total" ~ "I1",
      Indicador == "Activo Productivo de Intermediación Financiera / Activo Productivo" ~ "I2",
      Indicador == "Activo Productivo de Intermediación Financiera/ Pasivo con Costo  1" ~ "I3",
      Indicador == "Captaciones a plazo con el público / Pasivo con costo" ~ "I4",
      Indicador == "Cartera al día y con atraso de hasta 90 días (excepto cobro judicial) / Activo Productivo" ~ "I5",
      Indicador == "Cartera al día y con atraso hasta 90 días/Cartera total" ~ "I6",
      Indicador == "Compromiso patrimonial" ~ "I7",
      Indicador == "Estimaciones sobre cartera de créditos / Cartera con atraso mayor a 90 días y cobro judicial" ~ "I8",
      Indicador == "Inversiones en títulos valores / Activo Productivo de Intermediación Financiera" ~ "I9",
      Indicador == "Morosidad mayor a 90 días y cobro judicial / Cartera Directa" ~ "I10",
      Indicador == "Obligaciones con entidades financieras del exterior / Pasivo con costo" ~ "I11",
      Indicador == "Obligaciones con entidades financieras del país / Pasivo con costo" ~ "I12",
      Indicador == "Pasivo con costo / Pasivo Total" ~ "I13",
      Indicador == "Rentabilidad nominal sobre Patrimonio Promedio" ~ "I14",
      Indicador == "Utilidad Operacional Bruta / Gastos de Administración  1" ~ "I15",
      TRUE ~ Indicador
    )) %>%
    pivot_wider(names_from = Indicador, values_from = Valor)


  # Paneles por grupo 
  # Asegurar clase Date
  if (!inherits(df_wide$Periodo, "Date")) df_wide$Periodo <- as.Date(df_wide$Periodo)

  # Quitar posibles duplicados, por Entidad y periodo
  df_wide = df_wide %>% distinct(Entidad, Periodo, .keep_all = TRUE)

  df_coop  = df_wide %>% filter(GRUPO == "COOPERATIVAS") %>% as.data.frame()
  df_otros = df_wide %>% filter(GRUPO == "OTROS")         %>% as.data.frame()

  panel_coop  = pdata.frame(df_coop,  index = c("Entidad","Periodo"))
  panel_otros = pdata.frame(df_otros, index = c("Entidad","Periodo"))

  # Modelos (RE) con IMAE 
  cat("========= MODELOS PARA COOPERATIVAS (EFECTOS ALEATORIOS) =========\n")
  modelo_coop_I6  = plm(I6  ~ TPC + TBP + IPC + IMAE, data = panel_coop,  model = "random", na.action = na.omit)
  modelo_coop_I14 = plm(I14 ~ TPC + TBP + IPC + IMAE, data = panel_coop,  model = "random", na.action = na.omit)

  cat("\n========= MODELOS PARA OTROS (EFECTOS ALEATORIOS) =========\n")
  modelo_otros_I6  = plm(I6  ~ TPC + TBP + IPC + IMAE, data = panel_otros, model = "random", na.action = na.omit)
  modelo_otros_I14 = plm(I14 ~ TPC + TBP + IPC + IMAE, data = panel_otros, model = "random", na.action = na.omit)

  # Resúmen por indicadores
  cat("\n\n=========== RESÚMENES COMPLETOS DE LOS MODELOS ==========\n")

  modelos_coop  = list(I6 = modelo_coop_I6,  I14 = modelo_coop_I14)
  modelos_otros = list(I6 = modelo_otros_I6, I14 = modelo_otros_I14)

  cat("\n--- MODELOS COOPERATIVAS ---\n")
  for (nombre in names(modelos_coop)) {
    cat(paste0("\n\n>>> Modelo COOP: ", nombre, "\n"))
    print(summary(modelos_coop[[nombre]]))}

  cat("\n--- MODELOS OTROS ---\n")
  for (nombre in names(modelos_otros)) {
    cat(paste0("\n\n>>> Modelo OTROS: ", nombre, "\n"))
    print(summary(modelos_otros[[nombre]]))}

  # EFECTOS FIJOS - WITHIN
  library(plm)
  library(lmtest)
  library(sandwich)
  library(dplyr)

  # Reconstruir paneles 
  if (!inherits(df_wide$Periodo, "Date")) df_wide$Periodo <- as.Date(df_wide$Periodo)

  df_coop  = df_wide %>%
    filter(GRUPO == "COOPERATIVAS") %>%
    distinct(Entidad, Periodo, .keep_all = TRUE) %>%
    as.data.frame()

  df_otros = df_wide %>%
    filter(GRUPO == "OTROS") %>%
    distinct(Entidad, Periodo, .keep_all = TRUE) %>%
    as.data.frame()

  panel_coop  = pdata.frame(df_coop,  index = c("Entidad", "Periodo"))
  panel_otros = pdata.frame(df_otros, index = c("Entidad", "Periodo"))

  cat("========= EFECTOS FIJOS (INDIVIDUAL) - COOPERATIVAS =========\n")
  fe_coop_I6  = plm(I6  ~ TPC + TBP + IPC + IMAE, data = panel_coop,
                    model = "within", effect = "individual", na.action = na.omit)
  fe_coop_I14 = plm(I14 ~ TPC + TBP + IPC + IMAE, data = panel_coop,
                    model = "within", effect = "individual", na.action = na.omit)

  cat("\n========= EFECTOS FIJOS (INDIVIDUAL) - OTROS =========\n")
  fe_otros_I6  = plm(I6  ~ TPC + TBP + IPC + IMAE, data = panel_otros,
                      model = "within", effect = "individual", na.action = na.omit)
  fe_otros_I14 = plm(I14 ~ TPC + TBP + IPC + IMAE, data = panel_otros,
                      model = "within", effect = "individual", na.action = na.omit)

  # Resultados con errores estándar robustos (cluster por entidad)
  cat("\n--- Resultados COOPERATIVAS (robustos) ---\n")
  print(coeftest(fe_coop_I6,  vcov. = vcovHC(fe_coop_I6,  type = "HC1", cluster = "group")))
  print(coeftest(fe_coop_I14, vcov. = vcovHC(fe_coop_I14, type = "HC1", cluster = "group")))

  cat("\n--- Resultados OTROS (robustos) ---\n")
  print(coeftest(fe_otros_I6,  vcov. = vcovHC(fe_otros_I6,  type = "HC1", cluster = "group")))
  print(coeftest(fe_otros_I14, vcov. = vcovHC(fe_otros_I14, type = "HC1", cluster = "group")))


  # HAUSMAN: FE vs RE Nota: esto es para evaluar que modelo Efectos fijos o aleatorios representa mejor el modelo
  library(plm)

  dictamen_haus = function(test) {
    if (is.null(test$p.value) || is.na(test$p.value)) return("p-valor no disponible")
    if (test$p.value < 0.05) "Prefiere FE (RE inconsistente)" else "Prefiere RE (exogeneidad plausible)"}


  #H0 (nula): RE es consistente (los efectos no observados de cada entidad no están correlacionados con los regresores). Si H0 es cierta, RE es además más eficiente que FE
  #H1 (alternativa): uno de los modelos es inconsistente (típicamente, RE), por correlación entre efectos no observados y regresores - preferir FE
  cat("\n================ HAUSMAN FE vs RE (phtest) ================\n")

  cat("\n--- COOPERATIVAS: I6 ---\n")
  haus_coop_I6 = phtest(fe_coop_I6,  modelo_coop_I6)
  print(haus_coop_I6);  cat("Dictamen: ", dictamen_haus(haus_coop_I6),  "\n")

  cat("\n--- COOPERATIVAS: I14 ---\n")
  haus_coop_I14 = phtest(fe_coop_I14, modelo_coop_I14)
  print(haus_coop_I14); cat("Dictamen: ", dictamen_haus(haus_coop_I14), "\n")

  cat("\n--- OTROS: I6 ---\n")
  haus_otros_I6 = phtest(fe_otros_I6,  modelo_otros_I6)
  print(haus_otros_I6);  cat("Dictamen: ", dictamen_haus(haus_otros_I6),  "\n")

  cat("\n--- OTROS: I14 ---\n")
  haus_otros_I14 = phtest(fe_otros_I14, modelo_otros_I14)
  print(haus_otros_I14); cat("Dictamen: ", dictamen_haus(haus_otros_I14), "\n")


  #REVISION ROBUSTA PARAVER SIGNIFICANCIA DE PANEL 
  # Hay o no efecto panel? (RE vs pooled)
  plmtest(modelo_coop_I6,  type="honda") 
  plmtest(modelo_coop_I14, type="honda")
  plmtest(modelo_otros_I6, type="honda")
  plmtest(modelo_otros_I14,type="honda")
  #Nota: explicacion Es un test LM (Honda) para saber si hay efectos de panel (individuales o de tiempo)
  #H0: no hay efectos pooled OLS basta
  #Si p < 0.05: hay efectos usa modelo de panel (RE o FE)

  #REVISION PARA VER SIGNIFICANCIA DE PANEL 

  pool_coop_I6  = plm(I6  ~ TPC + TBP + IPC + IMAE, data=panel_coop,  model="pooling")
  pFtest(fe_coop_I6, pool_coop_I6)
  # Nota (pFtest FE vs pooled):
  # H0: sin efectos por entidad (pooled suficiente).
  # Resultado: F = 15.07 (df1 = 5, df2 = 572), p = 6.446e-14  - Rechazo H0.
  # Conclusión: sí hay heterogeneidad entre entidades; pooled OLS no procede.
  #Si el resultado de esta prueba el Hausman es de p = 1, se usa RE.


  #Errores robustos
  library(lmtest); library(sandwich)
  coeftest(modelo_coop_I6,  vcov=function(x) vcovHC(x, method="arellano", type="HC1", cluster="group"))

  #Modelos con rezagos 
  library(plm)
  library(lmtest); library(sandwich)

  # Función corta para mostrar R²
  print_r2 = function(modelo, etiqueta) {
    s = summary(modelo)
    cat("\nR-cuadrado —", etiqueta, "\n")
    if (is.null(s$r.squared)) {
      cat("No disponible para este modelo.\n")
    } else {
      print(round(s$r.squared, 4))  # within / between / overall
    }
  }
  # COOPERATIVAS (RE) 
  # I6 con solo lag 2 en cada explicativa
  modelo_coop_I6_lag2 = plm(
    I6 ~ plm::lag(TPC, 4) + plm::lag(TBP, 6) + plm::lag(IPC, 9) + plm::lag(IMAE, 6),
    data = panel_coop, model = "random", na.action = na.omit
  )
  print_r2(modelo_coop_I6_lag2, "COOP | I6 | lag2")
  coeftest(modelo_coop_I6_lag2, vcov = function(x) vcovHC(x, method="arellano", type="HC1", cluster="group"))

  # I14 con solo lag 2 en cada explicativa
  modelo_coop_I14_lag2 = plm(
    I14 ~ plm::lag(TPC, 4) + plm::lag(TBP, 6) + plm::lag(IPC, 9) + plm::lag(IMAE, 6),
    data = panel_coop, model = "random", na.action = na.omit
  )
  print_r2(modelo_coop_I14_lag2, "COOP | I14 | lag2")
  coeftest(modelo_coop_I14_lag2, vcov = function(x) vcovHC(x, method="arellano", type="HC1", cluster="group"))


  #  OTROS (RE)
  # I6 con solo lag 2 en cada explicativa
  modelo_otros_I6_lag2 <- plm(
    I6 ~ plm::lag(TPC, 2) + plm::lag(TBP, 2) + plm::lag(IPC, 2) + plm::lag(IMAE, 2),
    data = panel_otros, model = "random", na.action = na.omit
  )
  print_r2(modelo_otros_I6_lag2, "OTROS | I6 | lag2")
  coeftest(modelo_otros_I6_lag2, vcov = function(x) vcovHC(x, method="arellano", type="HC1", cluster="group"))

  # I14 con solo lag 2 en cada explicativa
  modelo_otros_I14_lag2 <- plm(
    I14 ~ plm::lag(TPC, 2) + plm::lag(TBP, 2) + plm::lag(IPC, 2) + plm::lag(IMAE, 2),
    data = panel_otros, model = "random", na.action = na.omit
  )
  print_r2(modelo_otros_I14_lag2, "OTROS | I14 | lag2")
  coeftest(modelo_otros_I14_lag2, vcov = function(x) vcovHC(x, method="arellano", type="HC1", cluster="group"))


  # PRUEBAS DE LOS MODELOS

  #####Heterocedasticidad (Prueba de Breusch-Pagan modificada)
  bptest(modelo_coop_I6)
  bptest(modelo_otros_I6)
  #Autocorrelación serial (Prueba de Wooldridge)
  pwartest(modelo_coop_I6)   # Wooldridge test
  pwartest(modelo_otros_I6)
  # Errores robustos estándar
  coeftest(modelo_otros_I6, vcov = vcovHC(modelo_otros_I6, type = "HC1"))
  # Errores Driscoll-Kraay (si hay autocorrelación en panel)
  coeftest(modelo_otros_I6, vcov = vcovSCC(modelo_otros_I6))
  #Multicolinealidad (VIF
  # Modelo MCO para grupo "cooperativas" y cálculo de VIF
  ols_model_coop = lm(I6 ~ TPC + TBP + IPC, data = filter(panel_data, GRUPO == "COOPERATIVAS"))
  vif(ols_model_coop)
  # Modelo MCO para grupo "OTROS bancos " y cálculo de VIF
  ols_model_otros = lm(I6 ~ TPC + TBP + IPC, data = filter(panel_data, GRUPO == "OTROS"))
  vif(ols_model_otros)
`;

const contents = [
  { id: "objective", label: "Objetivo del análisis" },
  { id: "financial-indicators", label: "Indicadores financieros" },
  { id: "macroeconomic-variables", label: "Variables macroeconómicas" },
  { id: "panel-model", label: "Modelo de datos de panel" },
  { id: "original-series", label: "Series originales" },
  { id: "diagnostics", label: "Pruebas y diagnóstico" },
  { id: "original-results", label: "Resultados originales" },
  { id: "breusch-pagan", label: "Prueba Breusch-Pagan" },
  { id: "driscoll-kraay", label: "Ajuste Driscoll-Kraay" },
  { id: "project-reference", label: "Referencia y autoría" },
  { id: "source-code", label: "Código fuente" },
];

const financialIndicators = [
  [
    "Activo productivo de intermediación financiera / Pasivo con costo",
    "Mide la eficiencia con la que la institución transforma los recursos captados en activos generadores de ingresos. También se relaciona con la liquidez y la capacidad de cumplir obligaciones.",
  ],
  [
    "Cartera al día y con atraso hasta 90 días / Cartera total",
    "Mide la proporción de la cartera que se mantiene al día o con atrasos inferiores a 90 días. Un valor mayor representa una mejor calidad de cartera.",
  ],
  [
    "Rentabilidad nominal / Patrimonio promedio",
    "Mide la rentabilidad generada por el patrimonio de la institución. Una relación más alta implica una mayor rentabilidad para los propietarios.",
  ],
];

const macroeconomicVariables = [
  [
    "Tasa Básica Pasiva (TBP)",
    "Representa el costo promedio de captación de recursos en colones y permite aproximar los efectos de la política monetaria sobre las instituciones financieras.",
  ],
  [
    "Tasa de desempleo (TDESP)",
    "Refleja la situación del mercado laboral y la capacidad de los hogares para solicitar y pagar financiamiento.",
  ],
  [
    "Índice de Precios al Consumidor (IPC)",
    "Mide la evolución de los precios, el poder adquisitivo y las condiciones inflacionarias de la economía.",
  ],
  [
    "Índice Mensual de Actividad Económica (IMAE)",
    "Mide mensualmente el dinamismo de la economía. Se utilizó el IMAE del régimen definitivo.",
  ],
  [
    "Índice de Confianza del Consumidor (ICC)",
    "Mide la percepción de los consumidores sobre su situación económica actual y futura, lo cual puede influir sobre el consumo y la demanda de crédito.",
  ],
];

const originalProductiveAssetRows = [
  ["TBP", "N/A", "−0.00275506"],
  ["IPC", "−0.00447981", "0.00120851"],
  ["IMAE", "N/A", "−0.00105387"],
  ["ICC", "N/A", "−0.00048224"],
  ["R²", "0.18973", "0.075286"],
];

const originalPortfolioRows = [
  ["TBP", "−2.268794", "−0.845942"],
  ["IPC", "0.223593", "0.142432"],
  ["TDESP", "N/A", "−0.944492"],
  ["R²", "0.1594", "0.6122"],
];

const originalProfitabilityRows = [
  ["TBP", "0.42391", "−0.780748"],
  ["IPC", "−0.151782", "N/A"],
  ["IMAE", "N/A", "−0.0593950"],
  ["R²", "0.44091", "0.067067"],
];

const bpProductiveAssetRows = [
  ["Cooperativas", "24.378", "0.0001837", "Rechaza H₀ → hay heterocedasticidad"],
  ["Otras instituciones", "1.5608", "0.9059", "No se rechaza H₀ → homocedasticidad"],
];

const bpPortfolioRows = [
  ["Cooperativas", "7.5669", "0.1818", "No se rechaza H₀ → homocedasticidad"],
  ["Otras instituciones", "26.147", "0.00008355", "Rechaza H₀ → hay heterocedasticidad"],
];

const bpProfitabilityRows = [
  ["Cooperativas", "70.021", "1.015E-13", "Rechaza H₀ → hay heterocedasticidad"],
  ["Otras instituciones", "6.7357", "0.2411", "No se rechaza H₀ → homocedasticidad"],
];

const robustProductiveAssetRows = [
  ["IPC", "−0.00447981", "−0.00120851"],
  ["TDESP", "−0.00529603", "N/A"],
  ["IMAE", "N/A", "0.00105387"],
];

const robustPortfolioRows = [
  ["TBP", "−2.268794", "−0.845942"],
  ["IPC", "0.223593", "0.142432"],
  ["TDESP", "N/A", "−0.944492"],
];

const robustProfitabilityRows = [
  ["TBP", "0.42391", "−0.7807548"],
  ["IPC", "−0.151782", "N/A"],
  ["TDESP", "0.063372", "N/A"],
  ["IMAE", "N/A", "−0.059395"],
];

export default function BanhviPanelArticle() {
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
          <section className="mx-auto mb-6 max-w-6xl px-1 pt-8 sm:px-1">
            <Link
              href="/projects/modelo01"
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
              Econometría financiera
            </span>
            <span className="text-sm text-slate-500">Artículo técnico</span>
          </div>

          <h1 className="max-w-5xl text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Datos de panel de los clientes institucionales del BANHVI
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">
            Evaluación de la relación entre variables macroeconómicas y el
            desempeño financiero de las instituciones que conforman la cartera
            institucional del Banco Hipotecario de la Vivienda.
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
              
              <ArticleTitle number="01">Objetivo del análisis</ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El estudio utiliza modelos de datos de panel para determinar
                  la relación existente entre diferentes variables
                  macroeconómicas y el desempeño financiero de las
                  instituciones que forman parte de la cartera de clientes del
                  Banco Hipotecario de la Vivienda, BANHVI.
                </p>

                <p>
                  Los modelos de panel combinan información de corte
                  transversal de diferentes instituciones financieras con
                  series de tiempo. Esta metodología permite trabajar con una
                  mayor cantidad de observaciones, incrementar la variabilidad
                  de los datos, reducir problemas de colinealidad y mejorar la
                  eficiencia estadística de las estimaciones.
                </p>

                <p>
                  A partir de un ejercicio previo de clusterización, las
                  instituciones fueron agrupadas en dos categorías:
                </p>

                <BulletList
                  items={[
                    "Cooperativas.",
                    "Otras instituciones, conformadas principalmente por bancos y otras entidades financieras.",
                  ]}
                />

                <p>
                  El período general de estudio comprende desde enero de 2016
                  hasta febrero de 2025. Sin embargo, para identificar
                  relaciones estructurales y evitar que los resultados fueran
                  dominados por eventos extraordinarios, se excluyó el período
                  comprendido entre marzo de 2020 y diciembre de 2023, asociado
                  con la crisis sanitaria COVID-19 y sus consecuencias
                  económicas.
                </p>

                <p>
                  Después de esta exclusión, cada institución contó con 62
                  observaciones. Por tanto, se trabajó con paneles balanceados,
                  porque cada institución tiene el mismo número de
                  observaciones, y largos, porque la cantidad de períodos
                  supera la cantidad de instituciones analizadas.
                </p>

                <blockquote className="my-8 border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  El propósito central fue identificar relaciones económicas
                  estructurales entre el entorno macroeconómico y el desempeño
                  financiero de las instituciones, sin que los resultados
                  fueran determinados por shocks sistémicos atípicos.
                </blockquote>
              </div>
            </section>

            <section
              id="financial-indicators"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="02">
                Indicadores financieros analizados
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Se seleccionaron tres variables dependientes relacionadas con
                eficiencia, liquidez, calidad de cartera y rentabilidad.
              </p>

              <DataTable
                headers={["Indicador financiero", "Interpretación"]}
                rows={financialIndicators}
                caption="Tabla. Indicadores financieros seleccionados para el análisis."
              />
            </section>

            <section
              id="macroeconomic-variables"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="03">
                Variables macroeconómicas
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Se utilizaron cinco indicadores macroeconómicos como variables
                independientes.
              </p>

              <DataTable
                headers={["Variable", "Descripción y relevancia"]}
                rows={macroeconomicVariables}
                caption="Tabla. Variables macroeconómicas utilizadas en los modelos."
              />
            </section>

            <section
              id="panel-model"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="04">
                Especificación del modelo de datos de panel
              </ArticleTitle>

              <p className="text-[17px] leading-8 text-slate-300">
                La fórmula general utilizada para las estimaciones fue:
              </p>

              <div className="my-8 overflow-x-auto rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] px-6 py-7 text-center shadow-xl shadow-black/20">
                <p className="min-w-[720px] font-serif text-xl text-indigo-100 sm:text-2xl">
                  Y<sub>it</sub> = α<sub>i</sub> + β<sub>1</sub>TBP
                  <sub>t</sub> + β<sub>2</sub>IPC<sub>t</sub> + β
                  <sub>3</sub>TDESP<sub>t</sub> + β<sub>4</sub>IMAE
                  <sub>t</sub> + β<sub>5</sub>ICC<sub>t</sub> + u
                  <sub>it</sub>
                </p>
              </div>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>Donde:</p>
                <BulletList
                  items={[
                    "αᵢ recoge las características estructurales no observadas de cada institución.",
                    "Las variables explicativas son macroeconómicas y comunes a todas las instituciones en cada período.",
                    "uᵢₜ es el término de error.",
                  ]}
                />

                <p>
                  Estas especificaciones se estiman por separado para cada uno
                  de los tres indicadores financieros seleccionados como
                  variables dependientes:
                </p>

                <ol className="space-y-3 pl-6 text-slate-300">
                  <li className="list-decimal">
                    Activo productivo de intermediación financiera / Pasivo con
                    costo, asociado con eficiencia y liquidez.
                  </li>
                  <li className="list-decimal">
                    Cartera al día y con atraso hasta 90 días / Cartera total,
                    asociado con calidad de cartera.
                  </li>
                  <li className="list-decimal">
                    Rentabilidad nominal / Patrimonio promedio, asociado con
                    rentabilidad sobre patrimonio.
                  </li>
                </ol>
              </div>
            </section>

            <section
              id="original-series"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="05">
                Modelos con series originales
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                En esta primera etapa se utilizaron las series de tiempo
                originales. Los gráficos siguientes presentan la evolución de
                las variables macroeconómicas durante el período 2016-2025.
              </p>

              <div className="space-y-10">
                <FigureCard
                  image="/images/banhvi/tbp-2016-2025.png"
                  title="Gráfico 1. Tasa Básica Pasiva 2016-2025"
                  alt="Evolución de la Tasa Básica Pasiva entre 2016 y 2025"
                  source="Fuente: elaboración propia con datos del BCCR (Costa Rica)."
                />

                <FigureCard
                  image="/images/banhvi/ipc-2016-2025.png"
                  title="Gráfico 2. Índice de Precios al Consumidor 2016-2025"
                  alt="Evolución del Índice de Precios al Consumidor entre 2016 y 2025"
                  source="Fuente: elaboración propia con datos del BCCR (Costa Rica)."
                />

                <FigureCard
                  image="/images/banhvi/desempleo-2016-2025.png"
                  title="Gráfico 3. Tasa de Desempleo 2016-2025"
                  alt="Evolución de la tasa de desempleo entre 2016 y 2025"
                  source="Fuente: elaboración propia con datos del BCCR (Costa Rica)."
                />

                <FigureCard
                  image="/images/banhvi/imae-2016-2025.png"
                  title="Gráfico 4. Índice Mensual de Actividad Económica 2016-2025"
                  alt="Evolución del Índice Mensual de Actividad Económica entre 2016 y 2025"
                  source="Fuente: elaboración propia con datos del BCCR (Costa Rica), año 2025."
                />

                <FigureCard
                  image="/images/banhvi/icc-2016-2025.png"
                  title="Gráfico 5. Índice de Confianza del Consumidor 2016-2025"
                  alt="Evolución del Índice de Confianza del Consumidor entre 2016 y 2025"
                  source="Fuente: elaboración propia con datos de la Escuela de Estadística de la Universidad de Costa Rica."
                />
              </div>
            </section>

            <section
              id="diagnostics"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="06">
                Pruebas de estacionariedad y colinealidad
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <h3 className="text-xl font-semibold text-white">
                  Prueba Augmented Dickey-Fuller
                </h3>

                <p>
                  La prueba Augmented Dickey-Fuller arrojó valores p superiores
                  a 0,05 para todas las variables macroeconómicas. Por tanto,
                  no fue posible rechazar la hipótesis nula de presencia de
                  raíz unitaria. Esto confirma que las series originales son no
                  estacionarias.
                </p>

                <h3 className="pt-4 text-xl font-semibold text-white">
                  Colinealidad
                </h3>

                <p>
                  La colinealidad entre las variables se evaluó mediante el
                  Factor de Inflación de la Varianza, VIF, y la matriz de
                  correlaciones.
                </p>

                <p>
                  El Índice de Confianza del Consumidor y la tasa de desempleo
                  presentaron los valores VIF más elevados, cercanos a 5. Esto
                  representa una colinealidad moderada, pero no lo
                  suficientemente alta como para invalidar las regresiones.
                </p>
              </div>

              <div className="mt-8">
                <FigureCard
                  image="/images/banhvi/matriz-correlaciones.png"
                  title="Gráfico 6. Matriz de correlaciones – Series originales"
                  alt="Matriz de correlaciones de las variables macroeconómicas"
                  source="Fuente: elaboración propia con datos del BCCR."
                />
              </div>

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Para cada clúster se realizó una regresión utilizando el
                  método de Efectos Fijos y otra utilizando el método de
                  Efectos Aleatorios. Posteriormente, se realizó la prueba de
                  Hausman para identificar cuál de los dos modelos se ajusta
                  mejor con base en los datos disponibles.
                </p>

                <blockquote className="border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  La prueba de Hausman indicó en todos los casos la regresión
                  por Efectos Aleatorios.
                </blockquote>

                <p>
                  Las tablas siguientes muestran los coeficientes de las
                  variables explicativas que poseen un p-value significativo a
                  0,05.
                </p>
              </div>
            </section>

            <section
              id="original-results"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="07">
                Resultados de los modelos con datos originales
              </ArticleTitle>

              <ResultBlock
                title="Indicador: Activo Productivo de Intermediación Financiera / Pasivo con Costo"
                tableTitle="Tabla 1. Activo Productivo de Intermediación Financiera / Pasivo con Costo (Datos originales)"
                rows={originalProductiveAssetRows}
              >
                <p>
                  En las cooperativas, el IPC fue la única variable
                  significativa. Su coeficiente negativo indica que un aumento
                  de la inflación se relaciona con una reducción de la razón
                  entre activo productivo y pasivo con costo.
                </p>
                <p>
                  Esto sugiere que la inflación erosiona la eficiencia de
                  intermediación financiera de las cooperativas, posiblemente
                  como consecuencia de una menor demanda de crédito y una menor
                  capacidad de canalizar los recursos captados hacia activos
                  productivos.
                </p>
                <p>
                  En las otras instituciones, la TBP tiene un efecto negativo
                  debido al encarecimiento del fondeo; el IPC presentó
                  inicialmente un efecto levemente positivo; el IMAE tuvo una
                  relación negativa; y el ICC presentó un efecto negativo de
                  baja magnitud.
                </p>
                <p>
                  Los valores de R² son bajos en ambos clústeres. Por tanto,
                  las variables macroeconómicas explican solo una parte
                  limitada de la variación del indicador. Los resultados deben
                  interpretarse como relaciones marginales y no como una
                  explicación completa de su comportamiento.
                </p>
              </ResultBlock>

              <ResultBlock
                title="Indicador: Cartera al día y con atraso hasta 90 días / Cartera Total"
                tableTitle="Tabla 2. Cartera al día y con atraso hasta 90 días / Cartera Total (Datos originales)"
                rows={originalPortfolioRows}
              >
                <p>
                  La calidad de la cartera de las cooperativas presenta una
                  fuerte sensibilidad a la TBP. El coeficiente negativo de
                  −2,268794 implica que el aumento de las tasas se asocia con
                  una reducción importante de la proporción de cartera al día.
                </p>
                <p>
                  Esto evidencia que los deudores de las cooperativas son
                  particularmente vulnerables a los incrementos en las tasas
                  de interés.
                </p>
                <p>
                  El IPC presenta un coeficiente positivo. Sin embargo, esta
                  relación no necesariamente implica una mejora real del riesgo
                  de crédito. Puede estar relacionada con efectos nominales
                  sobre los saldos y con una reducción de la demanda de
                  financiamiento durante períodos inflacionarios.
                </p>
                <p>
                  En las otras instituciones también se identifica un efecto
                  negativo de la TBP, aunque de menor magnitud. Además, la tasa
                  de desempleo presenta un efecto negativo significativo,
                  mostrando que el deterioro del mercado laboral reduce
                  directamente la proporción de cartera al día.
                </p>
                <BulletList
                  items={[
                    "Cooperativas: R² de 0,1594.",
                    "Otras instituciones: R² de 0,6122.",
                  ]}
                />
                <p>
                  Esto indica que la calidad de cartera de las otras
                  instituciones se encuentra considerablemente más vinculada
                  con las condiciones macroeconómicas analizadas.
                </p>
              </ResultBlock>

              <ResultBlock
                title="Indicador: Rentabilidad Nominal / Patrimonio Promedio"
                tableTitle="Tabla 3. Rentabilidad Nominal / Patrimonio Promedio (Datos originales)"
                rows={originalProfitabilityRows}
              >
                <p>
                  En las cooperativas, el coeficiente positivo de la TBP indica
                  que los aumentos en las tasas se relacionan con una mayor
                  rentabilidad sobre el patrimonio. Esto podría producirse
                  cuando el rendimiento de los activos se ajusta más
                  rápidamente que el costo de los recursos captados, generando
                  una ampliación de los márgenes financieros.
                </p>
                <p>
                  El IPC presenta un efecto negativo sobre la rentabilidad de
                  las cooperativas. La inflación puede reducir la demanda de
                  crédito y afectar la capacidad de las entidades para generar
                  activos productivos e ingresos financieros.
                </p>
                <p>
                  En las otras instituciones, la TBP tiene un coeficiente
                  negativo. Esto sugiere que el costo de fondeo aumenta más
                  rápidamente que el rendimiento de los activos, comprimiendo
                  los márgenes y la rentabilidad.
                </p>
                <p>
                  El IMAE también presenta un efecto negativo, aunque de menor
                  magnitud. Una posible interpretación es que durante períodos
                  de mayor actividad económica aumenta la competencia
                  financiera y la presión sobre los márgenes.
                </p>
                <p>
                  El R² del modelo de cooperativas alcanza 0,44091, mostrando
                  una capacidad explicativa relativamente importante. En las
                  otras instituciones, el R² es de apenas 0,067067.
                </p>
                <p>
                  Este modelo asume que las particularidades no observadas de
                  cada institución no se relacionan sistemáticamente con las
                  variables independientes, sino que se comportan de manera
                  aleatoria.
                </p>
              </ResultBlock>
            </section>

            <section
              id="breusch-pagan"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="08">
                Prueba de heterocedasticidad de Breusch-Pagan
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  La prueba se formuló a partir de las siguientes hipótesis:
                </p>

                <BulletList
                  items={[
                    "H₀: los errores tienen varianza constante.",
                    "H₁: la varianza de los errores depende de las variables X, por lo que existe heterocedasticidad.",
                  ]}
                />

                <p>
                  Si el p-value resultante se ubica por debajo del nivel de
                  significancia escogido de 0,05, se rechaza la hipótesis nula
                  de homocedasticidad y se concluye la presencia de
                  heterocedasticidad.
                </p>
              </div>

              <div className="mt-8 space-y-10">
                <DataTable
                  title="Tabla 4. Activo Productivo de Intermediación Financiera / Pasivo con Costo"
                  headers={["Grupo", "Estadístico BP", "p-value", "Conclusión"]}
                  rows={bpProductiveAssetRows}
                  caption="Fuente: elaboración propia."
                />

                <DataTable
                  title="Tabla 5. Cartera al día y con atraso hasta 90 días / Cartera Total"
                  headers={["Grupo", "Estadístico BP", "p-value", "Conclusión"]}
                  rows={bpPortfolioRows}
                  caption="Fuente: elaboración propia."
                />

                <DataTable
                  title="Tabla 6. Rentabilidad Nominal / Patrimonio Promedio"
                  headers={["Grupo", "Estadístico BP", "p-value", "Conclusión"]}
                  rows={bpProfitabilityRows}
                  caption="Fuente: elaboración propia."
                />
              </div>

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Los resultados muestran presencia de heterocedasticidad en
                  al menos uno de los clústeres para cada indicador financiero.
                  Esto justificó la aplicación de errores estándar robustos,
                  con Driscoll-Kraay como método principal y Arellano como
                  complemento.
                </p>
              </div>
            </section>

            <section
              id="driscoll-kraay"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="09">
                Aplicación del modelo Driscoll-Kraay
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El método Driscoll-Kraay corrige los errores estándar ante
                  problemas de heterocedasticidad, autocorrelación temporal y
                  dependencia entre instituciones.
                </p>

                <p>
                  La corrección no modifica los coeficientes estimados
                  originalmente. Su función es recalcular los errores estándar,
                  los valores t y los valores p, permitiendo determinar con
                  mayor precisión cuáles relaciones son estadísticamente
                  significativas.
                </p>

                <blockquote className="border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  Estos modelos se corren sobre la misma regresión de Efectos
                  Aleatorios, por lo que conservan los coeficientes originales,
                  pero presentan errores estándar, t-values y p-values
                  diferentes.
                </blockquote>
              </div>

              <ResultBlock
                title="Indicador: Activo Productivo de Intermediación Financiera / Pasivo con Costo"
                tableTitle="Tabla 7. Datos originales con ajuste Driscoll-Kraay"
                rows={robustProductiveAssetRows}
              >
                <p>
                  En las cooperativas se mantiene el efecto negativo del IPC.
                  Esto confirma de manera robusta que la inflación se relaciona
                  con una pérdida de eficiencia de intermediación.
                </p>
                <p>
                  Además, la tasa de desempleo se vuelve estadísticamente
                  significativa y presenta un efecto negativo. El deterioro
                  del mercado laboral también puede reducir la capacidad de
                  las cooperativas para colocar recursos de manera eficiente.
                </p>
                <p>
                  En las otras instituciones, la TBP y el ICC dejan de ser
                  significativos después de aplicar la corrección. El IPC
                  aparece con un efecto negativo, mientras que el IMAE presenta
                  un efecto positivo.
                </p>
                <BulletList
                  items={[
                    "La inflación perjudica la eficiencia de intermediación.",
                    "Una mayor actividad económica puede mejorar moderadamente la relación entre activos productivos y pasivos con costo.",
                  ]}
                />
              </ResultBlock>

              <ResultBlock
                title="Indicador: Cartera al día y con atraso hasta 90 días / Cartera Total"
                tableTitle="Tabla 8. Datos originales con ajuste Driscoll-Kraay"
                rows={robustPortfolioRows}
              >
                <p>
                  Las variables significativas y sus coeficientes se mantienen
                  respecto al modelo original. Esta estabilidad fortalece la
                  conclusión de que la calidad de la cartera está
                  estructuralmente relacionada con la política de tasas de
                  interés, la inflación y las condiciones del mercado laboral.
                </p>
                <p>
                  Las cooperativas continúan mostrando una sensibilidad más
                  alta frente a los aumentos en la TBP, mientras que la tasa de
                  desempleo es especialmente relevante para las otras
                  instituciones.
                </p>
                <p>
                  Este indicador presenta los resultados más estables después
                  de aplicar los errores robustos.
                </p>
                <p className="text-sm text-slate-500">
                  Nota: en los anexos 17 y 18 del trabajo se pueden observar
                  las salidas de los modelos con ajuste Driscoll-Kraay y
                  Arellano para este indicador.
                </p>
              </ResultBlock>

              <ResultBlock
                title="Indicador: Rentabilidad Nominal / Patrimonio Promedio"
                tableTitle="Tabla 9. Datos originales con ajuste Driscoll-Kraay"
                rows={robustProfitabilityRows}
              >
                <p>
                  En las cooperativas se mantienen las relaciones principales:
                  la TBP tiene un efecto positivo sobre la rentabilidad y el
                  IPC tiene un efecto negativo.
                </p>
                <p>
                  Además, la tasa de desempleo se incorpora como una variable
                  estadísticamente significativa. Según la interpretación
                  presentada en el estudio, este resultado refleja la
                  importancia de las condiciones del mercado laboral para la
                  rentabilidad y las pérdidas crediticias de las cooperativas.
                </p>
                <p>
                  En las otras instituciones se mantienen el efecto negativo de
                  la TBP y el efecto negativo del IMAE.
                </p>
                <p>
                  La estabilidad de los signos después de aplicar
                  Driscoll-Kraay indica que estas relaciones son estructurales
                  y no dependen únicamente de problemas en la estimación de los
                  errores estándar.
                </p>
              </ResultBlock>
            </section>

            <section
              id="project-reference"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="10">
                Referencia y autoría del proyecto
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El presente análisis forma parte del Trabajo Final de
                  Investigación Aplicada titulado{" "}
                  <em className="text-slate-200">
                    Evaluación de la solidez financiera de los clientes de la
                    cartera institucional del BANHVI dentro del sistema
                    financiero costarricense y sensibilización de la cartera
                    ante escenarios macroeconómicos adversos
                  </em>
                  , desarrollado para optar por el grado y título de Maestría
                  Profesional en Riesgo y Finanzas de la Universidad de Costa
                  Rica.
                </p>

                <p>El Trabajo Final de Graduación fue elaborado por:</p>

                <BulletList
                  items={[
                    "Henry Fabian Alvarado Vargas.",
                    "José Andrés Castillo Azofeifa.",
                    "Mario Alejandro Paniagua Barrantes.",
                  ]}
                />

                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                  <p className="font-semibold text-white">
                    Universidad de Costa Rica
                  </p>
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
                    financiero costarricense y sensibilización de la cartera
                    ante escenarios macroeconómicos adversos
                  </em>{" "}
                  [Trabajo final de investigación aplicada de maestría,
                  Universidad de Costa Rica].
                </div>
              </div>
            </section>

            <section id="source-code" className="scroll-mt-28 pt-12">
              <ArticleTitle number="11">Código fuente</ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Este apartado queda preparado para incorporar posteriormente el
                script completo utilizado en el análisis.
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
                      panel_banhvi.R
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
                  Desplácese dentro del recuadro para consultar el script
                  completo.
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
                  Metodología
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    "Datos de panel",
                    "Efectos aleatorios",
                    "Hausman",
                    "Breusch-Pagan",
                    "Driscoll-Kraay",
                  ].map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-white/10 bg-[#0c1729] px-3 py-1.5 text-xs text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 pl-6 text-slate-300">
      {items.map((item) => (
        <li key={item} className="list-disc pl-1">
          {item}
        </li>
      ))}
    </ul>
  );
}

type DataTableProps = {
  headers: string[];
  rows: string[][];
  title?: string;
  caption?: string;
};

function DataTable({ headers, rows, title, caption }: DataTableProps) {
  return (
    <div>
      {title ? (
        <h3 className="mb-4 text-lg font-semibold leading-7 text-white">
          {title}
        </h3>
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
                      : ""
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
        <p className="mt-3 text-center text-xs leading-5 text-slate-500">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

type FigureCardProps = {
  image: string;
  title: string;
  alt: string;
  source: string;
  objectFit?: "contain" | "cover";
};

function FigureCard({
  image,
  title,
  alt,
  source,
  objectFit = "contain",
}: FigureCardProps) {
  return (
    <figure className="w-full">
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#07101f] p-3 shadow-2xl shadow-black/30">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className={`block h-auto max-h-[760px] w-full rounded-xl bg-white ${
            objectFit === "contain" ? "object-contain" : "object-cover"
          }`}
        />
      </div>

      <figcaption className="mt-3 text-center text-xs leading-5 text-slate-500">
        {source}
      </figcaption>
    </figure>
  );
}

type ResultBlockProps = {
  title: string;
  tableTitle: string;
  rows: string[][];
  children: ReactNode;
};

function ResultBlock({
  title,
  tableTitle,
  rows,
  children,
}: ResultBlockProps) {
  return (
    <div className="border-b border-white/10 py-12 first:pt-0 last:border-b-0 last:pb-0">
      <h3 className="mb-6 text-xl font-semibold leading-8 text-white">
        {title}
      </h3>

      <DataTable
        title={tableTitle}
        headers={["Variable", "Cooperativas", "Otras instituciones"]}
        rows={rows}
        caption="Fuente: elaboración propia. Modelo de Efectos Aleatorios."
      />

      <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
        {children}
      </div>
    </div>
  );
}