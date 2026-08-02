"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const sourceCode = String.raw`
#Librerias 
# library(lmtest) #para coeftest() y bptest(). 
# library(broom) #para glance() y tidy() 
# library(PoEdata) #para PoE4 bases de datos
# library(car) #para hccm() errores estandar robustos
# library(sandwich)
# library(knitr)
# library(stargazer)
# library(skimr)
# library(PoEdata)

# #DATOS IMPORTADOS 
# library(readxl)
# View(TODA_LA_DATA)  
# head(TODA_LA_DATA)
# names(TODA_LA_DATA)

# #DIMENSIONES DE MATRIZ
# dim(TODA_LA_DATA) 

# #SUMARY 
# sumary(TODA_LA_DATA)
# install.packages("skimr")
# library(skimr)
# skim(TODA_LA_DATA) 
# summary(TODA_LA_DATA)

# #PAKETE DE EXPLORACION DE LA DATA
# install.packages("DataExplorer")
# library(DataExplorer)
# plot_str(TODA_LA_DATA) 

# #datos en la base 

# DataExplorer::plot_str(TODA_LA_DATA)
# DataExplorer::plot_intro(TODA_LA_DATA)
# DataExplorer::plot_missing(TODA_LA_DATA) 

# #Histogramas 
# DataExplorer::plot_histogram(TODA_LA_DATA$EMBI) 
# DataExplorer::plot_histogram(TODA_LA_DATA$TIPOCAMBIO_VENTA) 
# DataExplorer::plot_histogram(TODA_LA_DATA$GDP_PERCAPITA)

# #funciones densidad 
# DataExplorer::plot_density(TODA_LA_DATA)

# #Quintiles
# DataExplorer::plot_qq(TODA_LA_DATA)

# #otros, definir var referencia, se hace con respecto IED
# DataExplorer::plot_boxplot(TODA_LA_DATA, )

# #MATRIZ DE CORRELACION 
# DataExplorer::plot_correlation(TODA_LA_DATA) 

# #Regresion 01-pRIMER AVANCE
# Mod01 <-  lm(IED_DL~EMBI+TIPOCAMBIO_VENTA,TODA_LA_DATA)
# print(Mod01) 
# summary(Mod01)

# #Regresion 02
# Mod02 <-lm(IED_DL~EMBI+TASA_DOLARES+TIPOCAMBIO_VENTA+Tasa_variacion,TODA_LA_DATA)
# print(Mod02) 
# summary(Mod02)

# #Regresion 03-rezagos
# #2 rezagos en TASA_DOLARES y 3 Tasa_variacion
# TODA_LA_DATA$Tasa_variacion_lag3 <- c(NA,NA, head(TODA_LA_DATA$Tasa_variacion, -2))
# TODA_LA_DATA$TASA_DOLARES_lag2 <- c(NA,NA, head(TODA_LA_DATA$TASA_DOLARES, -2))
# Mod03 <-lm(IED_DL~EMBI+TASA_DOLARES_lag2+TIPOCAMBIO_VENTA+Tasa_variacion_lag3,TODA_LA_DATA)
# print(Mod03) 
# summary(Mod03)


#   #Pruebas#
# #Heteroscedasticidad
# # Test Breusch-Pagan 
# bptest(Mod01)

# #Prueba de normalidad de los errores 
# shapiro.test(residuals(Mod01)) 

# #Prueba de autocorrelación (Durbin-Watson)
# durbinWatsonTest(Mod01)

# #Mayor a 10 fallan prueba de MC-Multicolinealidad 
# vif(Mod01)

# #var librerias 
# library(tseries) 
# library(dynlm) 
# library(vars)
# library(nlWaldTest)  
# library(lmtes) 
# library(broom)
# library(PoEdata)
# library(car)
# library(sandwich)
# library(knitr)
# library(forecast)
# rm(list=ls())

# ###==============VAR========================================================
# #Serie de tiempo
# VAR1 <- ts(DATA_VAR, start=c(2008,1),end=c(2023,3),frequency=4)
# print(VAR1) 
# summary(VAR1)

# #Evaluar estacionariedad y cointegracion
# #Graficar
# acf(VAR1[,"IED_DL"],plot=TRUE) 
# acf(VAR1[,"G_educacion"],plot=TRUE) 

# #Prueba estacionariedad

# adf.test(VAR1[,"IED_DL"]) 
# adf.test(VAR1[,"G_educacion"])          


# #Crear las diferencias
# dIED<-diff(VAR1[,"IED_DL"])
# dEDU<-diff(VAR1[,"G_educacion"])

# #Graficar DIFERENCIAS 
# ts.plot(dIED,dEDU, type="l",lty=c(1,2), col=c(1,2))

# #rezagos optimos
# acf(dIED,plot=TRUE)
# acf(dEDU,plot=TRUE) 

# #pRUEBA DIKE FULLER
# #Series una si es y otra no es estacionarias, probar diferencias
# adf.test(dIED)
# adf.test(dEDU)
                  
# #Estacionarias en diferencias, cointegracion  en este caso si son integradas en niveles origeniales 
# cointcy <- dynlm(IED_DL~G_educacion, DATA_VAR) 
# ehat <- resid(cointcy) 
# adf.test(ehat)            

# #Modelo VAR en niveles originales
# library(vars)
# VIED <- (VAR1[,"IED_DL"])
# VEDU <- (VAR1[,"G_educacion"])
# varmat <- as.matrix(cbind(VIED,VEDU))
# varfit <- VAR(varmat)
# summary(varfit)

# #Impulso respuesta, con intervalo de confianza
# impresp <- irf(varfit)
# plot(impresp)
# plot(fevd(varfit))
`;

const contents = [
  { id: "objective", label: "Objetivo e hipótesis" },
  { id: "context", label: "Contexto de la IED" },
  { id: "model", label: "Descripción del modelo" },
  { id: "methodology", label: "Metodología" },
  { id: "exploratory", label: "Análisis exploratorio" },
  { id: "correlation", label: "Matriz de correlación" },
  { id: "initial-regression", label: "Regresión inicial" },
  { id: "lags", label: "Rezagos y otras variables" },
  { id: "final-model", label: "Modelo final" },
  { id: "diagnostics", label: "Pruebas del modelo" },
  { id: "var", label: "Modelo VAR" },
  { id: "conclusions", label: "Conclusiones" },
  { id: "source-code", label: "Código fuente" },
];

const variableRows = [
  [
    "IED_DL",
    "Inversión extranjera directa",
    "Se utiliza la IED trimestral sin tratamiento adicional.",
  ],
  [
    "EMBI",
    "Emerging Markets Bonds Index",
    "Se utiliza la última evaluación de cada mes y se aplica una media geométrica para la trimestralización.",
  ],
  [
    "TASA_DOLARES",
    "Tasa de interés de Estados Unidos",
    "Se utiliza la tasa de interés trimestral sin tratamiento adicional.",
  ],
  [
    "TIPOCAMBIO_VENTA",
    "Tipo de cambio de venta",
    "Se utiliza el último valor de cada mes y se aplica una media geométrica para la trimestralización.",
  ],
  [
    "Tasa_variacion",
    "Tasa de variación del PIB",
    "Se utiliza el PIB trimestral y se calcula su variación respecto al trimestre correspondiente del año anterior.",
  ],
];

const initialCoefficientRows = [
  ["Intercepto", "−196.3538", "0.6981", "No significativo"],
  ["EMBI", "−48.2663", "0.0173", "Significativo al 5 %"],
  ["TASA_DOLARES", "−2.1708", "0.9367", "No significativo"],
  ["TIPOCAMBIO_VENTA", "1.8290", "0.0442", "Significativo al 5 %"],
  ["Tasa_variacion", "387.2519", "0.3517", "No significativo"],
];

const finalCoefficientRows = [
  ["Intercepto", "−2.4412", "0.9948", "No significativo"],
  ["EMBI", "−55.6274", "0.0035", "Significativo"],
  ["TIPOCAMBIO_VENTA", "1.5933", "0.0200", "Significativo"],
];

const diagnosticRows = [
  [
    "Breusch-Pagan",
    "0.2399",
    "No se rechaza la homocedasticidad; no existe evidencia suficiente de heterocedasticidad.",
  ],
  [
    "Shapiro-Wilk",
    "0.3391",
    "No se rechaza la normalidad; los residuos son compatibles con una distribución normal.",
  ],
  [
    "Durbin-Watson",
    "1.759259",
    "No se identifica evidencia relevante de autocorrelación en los residuos.",
  ],
  [
    "VIF",
    "Menor a 10",
    "El EMBI y el tipo de cambio no presentan problemas de multicolinealidad.",
  ],
];

export default function ForeignInvestmentArticle() {
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
              href="/projects/modelo03"
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
              Econometría
            </span>
            <span className="text-sm text-slate-500">Artículo técnico</span>
          </div>

          <h1 className="max-w-5xl text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Análisis econométrico de la Inversión Extranjera Directa en Costa Rica
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">
            Estudio de la relación entre la inversión extranjera directa, el
            riesgo país, el tipo de cambio, la tasa de interés estadounidense y
            el crecimiento económico durante el período 2008-2023.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span>
              Autor: {" "}
              <strong className="font-medium text-slate-300">
                Henry Alvarado Vargas
              </strong>
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>Universidad de Costa Rica</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>Ciclo I, 2024</span>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="min-w-0">
            <section
              id="objective"
              className="scroll-mt-28 border-b border-white/10 pb-12"
            >
              <ArticleTitle number="01">Objetivo e hipótesis</ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El objetivo general consiste en analizar la relación entre la
                  inversión extranjera directa en Costa Rica y las variables
                  independientes seleccionadas, con el propósito de comprender
                  cómo estas condiciones influyen sobre la atracción de inversión
                  extranjera al país.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <HypothesisCard
                    label="H₀"
                    title="Hipótesis nula"
                    text="Las variables independientes seleccionadas no tienen un efecto significativo sobre la inversión extranjera directa en Costa Rica."
                  />
                  <HypothesisCard
                    label="Ha"
                    title="Hipótesis alternativa"
                    text="Las variables independientes seleccionadas poseen un efecto significativo sobre la inversión extranjera directa en Costa Rica."
                  />
                </div>
              </div>
            </section>

            <section
              id="context"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="02">
                Contexto de la inversión extranjera directa
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Desde 1984, Costa Rica ha desarrollado un proceso de integración
                  creciente en la economía mundial mediante políticas de
                  desgravación arancelaria unilateral, minidevaluaciones en la
                  política cambiaria y leyes orientadas a incentivar las
                  exportaciones no tradicionales fuera del mercado
                  centroamericano.
                </p>

                <p>
                  La apertura comercial permitió atraer mayores flujos de
                  inversión extranjera directa. Sin embargo, la competencia
                  regional evidenció limitaciones relacionadas con los costos de
                  producción. Frente a ello, el país aprovechó sus ventajas
                  comparativas para atraer inversión hacia actividades que
                  requieren mano de obra más calificada, especialmente en sectores
                  tecnológicos de media y alta gama.
                </p>

                <p>
                  Costa Rica cuenta con instituciones como COMEX, PROCOMER y CINDE,
                  encargadas de promover la inversión extranjera. Esta estructura
                  institucional refleja la importancia otorgada a políticas de
                  atracción de inversión y desarrollo económico sostenible.
                </p>
              </div>
            </section>

            <section
              id="model"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="03">Descripción del modelo</ArticleTitle>

              <div className="space-y-5 text-[17px] leading-8 text-slate-300">
                <DefinitionCard
                  title="Tasa de crecimiento del PIB"
                  text="Un mayor crecimiento económico puede atraer inversión extranjera al reflejar oportunidades de mercado y estabilidad económica."
                />
                <DefinitionCard
                  title="Tipo de cambio"
                  text="Un tipo de cambio competitivo puede abaratar los costos relativos de inversión y mejorar la competitividad del país."
                />
                <DefinitionCard
                  title="Riesgo país"
                  text="Los inversionistas suelen evitar economías con niveles elevados de riesgo político, económico o social."
                />
                <DefinitionCard
                  title="Tasa de interés de Estados Unidos"
                  text="La tasa de la Reserva Federal puede modificar el atractivo relativo de invertir en Costa Rica frente a colocar recursos en activos denominados en dólares."
                />
              </div>
            </section>

            <section
              id="methodology"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="04">Metodología</ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  La investigación utiliza una serie temporal trimestral de la
                  inversión extranjera directa, la tasa de crecimiento del PIB,
                  el tipo de cambio, el riesgo país y la tasa de interés de la
                  Reserva Federal.
                </p>

                <p>
                  El período estudiado comprende desde el primer trimestre de
                  2008 hasta el tercer trimestre de 2023. La muestra contiene 63
                  observaciones obtenidas del Banco Central de Costa Rica, la
                  Reserva Federal de Estados Unidos y otras fuentes institucionales.
                </p>
              </div>

              <div className="mt-8">
                <DataTable
                  title="Tabla 1. Tratamiento de las variables"
                  headers={[
                    "Variable del modelo",
                    "Nombre de la variable",
                    "Descripción",
                  ]}
                  rows={variableRows}
                  caption="Fuente: elaboración propia."
                />
              </div>
            </section>

            <section
              id="exploratory"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="05">Análisis exploratorio</ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El resumen descriptivo permite observar el comportamiento
                  central, la dispersión y los valores extremos de la variable
                  dependiente y de las variables explicativas incluidas en el
                  modelo.
                </p>
              </div>

              <div className="mt-8 space-y-10">
                <FigureCard
                  image="/images/ied/resumen_exploratorio.png"
                  title="Tabla 2. Resumen exploratorio de variables"
                  alt="Resumen estadístico de las variables del modelo"
                  source="Fuente: elaboración propia en RStudio."
                  objectFit="contain"
                />

                <FigureCard
                  image="/images/ied/quintiles.png"
                  title="Ilustración 1. Gráficos de cuantiles"
                  alt="Gráficos de cuantiles de las variables del modelo"
                  source="Fuente: elaboración propia en RStudio."
                  objectFit="contain"
                />
              </div>
            </section>

            <section
              id="correlation"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="06">Matriz de correlación</ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  La matriz muestra relaciones lineales relativamente moderadas
                  entre las variables. A simple vista, no se observan
                  correlaciones suficientemente elevadas como para anticipar un
                  problema severo de multicolinealidad.
                </p>
              </div>

              <div className="mt-8">
                <FigureCard
                  image="/images/ied/matriz_correlacion.png"
                  title="Ilustración 2. Matriz de correlación"
                  alt="Matriz de correlación de las variables del modelo"
                  source="Fuente: elaboración propia en RStudio."
                  objectFit="contain"
                />
              </div>
            </section>

            <section
              id="initial-regression"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="07">
                Modelo de regresión sin rezagos
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                La primera especificación explica la inversión extranjera directa
                mediante cuatro variables independientes, sin rezagos ni ajustes
                adicionales.
              </p>

              <FigureCard
                image="/images/ied/modelo_inicial.png"
                title="Ilustración 3. Modelo de regresión sin rezagos"
                alt="Salida del modelo de regresión inicial"
                source="Fuente: elaboración propia en RStudio."
                objectFit="contain"
              />

              <div className="mt-10">
                <DataTable
                  title="Resultados principales del modelo inicial"
                  headers={[
                    "Variable",
                    "Coeficiente",
                    "p-value",
                    "Interpretación estadística",
                  ]}
                  rows={initialCoefficientRows}
                  caption="Los valores se derivan de la salida del modelo de regresión inicial."
                />
              </div>

              <div className="mt-10 space-y-6 text-[17px] leading-8 text-slate-300">
                <h3 className="text-xl font-semibold text-white">Residuos</h3>
                <p>
                  Los residuos se ubican entre −401,36 y 594,23. La mediana es
                  cercana a cero, lo que sugiere que, en promedio, el modelo no
                  presenta un sesgo marcado en sus predicciones.
                </p>

                <h3 className="pt-3 text-xl font-semibold text-white">
                  Interpretación de los coeficientes
                </h3>

                <p>
                  <strong className="text-white">EMBI:</strong> el coeficiente de
                  −48,2663 indica que un aumento de una unidad en el índice de
                  riesgo país se relaciona, ceteris paribus, con una reducción
                  aproximada de 48,27 unidades en la IED. El efecto es
                  estadísticamente significativo al 5 %.
                </p>

                <p>
                  <strong className="text-white">Tasa de interés de EE. UU.:</strong>{" "}
                  el coeficiente de −2,1708 muestra una relación negativa, pero no
                  significativa. Por ello se valoró la posibilidad de incorporar
                  efectos rezagados.
                </p>

                <p>
                  <strong className="text-white">Tipo de cambio de venta:</strong>{" "}
                  el coeficiente de 1,8290 indica que una unidad adicional en el
                  tipo de cambio se relaciona con un aumento aproximado de 1,83
                  unidades en la IED. Este efecto es significativo al 5 %.
                </p>

                <p>
                  <strong className="text-white">Variación del PIB:</strong> el
                  coeficiente de 387,2519 es positivo, pero no resulta
                  estadísticamente significativo.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard label="Error estándar residual" value="211,6" />
                  <MetricCard label="R² múltiple" value="19,66 %" />
                  <MetricCard label="R² ajustado" value="14,12 %" />
                  <MetricCard label="p-value prueba F" value="0,01173" />
                </div>

                <p>
                  El estadístico F es 3,548 y su valor p es 0,01173. Por tanto,
                  el modelo es globalmente significativo al nivel del 5 %, aunque
                  su capacidad explicativa continúa siendo limitada.
                </p>
              </div>
            </section>

            <section
              id="lags"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="08">
                Inclusión de rezagos y otras variables
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Para intentar captar los efectos de la tasa de variación del
                  PIB y de la tasa de interés estadounidense, se incorporaron dos
                  rezagos en ambas variables. Esta modificación no aportó un valor
                  explicativo adicional, posiblemente porque la relación entre
                  estas variables y las decisiones de inversión puede materializarse
                  durante horizontes de varios años.
                </p>

                <p>
                  También se estimó una especificación paralela con el PIB per
                  cápita y el ahorro per cápita de Estados Unidos, la calificación
                  soberana de Costa Rica y la inversión nacional en educación. La
                  inclusión conjunta de estas variables eliminó su significancia,
                  aun cuando algunas resultaban significativas de forma aislada.
                </p>

                <p>
                  Se intentó corregir la autocorrelación sin obtener una mejora
                  satisfactoria, por lo que se mantuvo la estructura del modelo
                  anterior y se excluyeron las variables que no aportaban poder
                  explicativo.
                </p>
              </div>
            </section>

            <section
              id="final-model"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="09">Modelo lineal final</ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Debido a que la variación del PIB y la tasa de interés de
                  Estados Unidos no aportaron valor explicativo ni funcionaron
                  como variables estabilizadoras, se excluyeron de la
                  especificación final. Con ello, el R² ajustado mejoró.
                </p>
              </div>

              <div className="mt-8">
                <FigureCard
                  image="/images/ied/modelo_final.png"
                  title="Ilustración 4. Modelo final"
                  alt="Salida del modelo econométrico final"
                  source="Fuente: elaboración propia en RStudio."
                  objectFit="contain"
                />
              </div>

              <div className="mt-10">
                <DataTable
                  title="Coeficientes del modelo final"
                  headers={[
                    "Variable",
                    "Coeficiente",
                    "p-value",
                    "Interpretación estadística",
                  ]}
                  rows={finalCoefficientRows}
                  caption="Ambas variables explicativas son estadísticamente significativas."
                />
              </div>

              <div className="mt-10 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El coeficiente del EMBI es −55,6274. Esto indica que una mayor
                  percepción de riesgo país se asocia con una disminución de la
                  inversión extranjera directa.
                </p>

                <p>
                  El coeficiente del tipo de cambio de venta es 1,5933. Por tanto,
                  un incremento del tipo de cambio se relaciona con un aumento de
                  la IED, manteniendo constantes las demás condiciones.
                </p>

                <p>
                  La prueba F presenta un valor p de 0,00253, indicando que las
                  variables independientes incluidas son conjuntamente útiles
                  para predecir la inversión extranjera directa.
                </p>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <MetricCard label="Error estándar residual" value="210,1" />
                  <MetricCard label="R² múltiple" value="18,07 %" />
                  <MetricCard label="R² ajustado" value="15,34 %" />
                  <MetricCard label="p-value prueba F" value="0,00253" />
                </div>
              </div>
            </section>

            <section
              id="diagnostics"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="10">Pruebas del modelo</ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                El modelo final fue evaluado mediante pruebas de
                heterocedasticidad, normalidad, autocorrelación y
                multicolinealidad.
              </p>

              <DataTable
                headers={["Prueba", "Resultado", "Conclusión"]}
                rows={diagnosticRows}
                caption="Resultados de las principales pruebas de diagnóstico del modelo final."
              />
            </section>

            <section
              id="var"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="11">Modelo VAR</ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Con fines prácticos se desarrolló un modelo VAR sin rezagos,
                  orientado a observar el comportamiento conjunto del EMBI y la
                  tasa de interés de Estados Unidos.
                </p>

                <blockquote className="border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  El documento original menciona esta estimación, pero no presenta
                  resultados numéricos ni gráficos adicionales del modelo VAR.
                </blockquote>
              </div>
            </section>

            <section
              id="conclusions"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="12">Conclusiones</ArticleTitle>

              <BulletList
                items={[
                  "Este proyecto ha logrado analizar de manera rigurosa la relación entre la IED en Costa Rica y varias variables independientes seleccionadas. Los hallazgos obtenidos a través del modelo de regresión desarrollado son robustos y relevantes para comprender los factores que afectan la atracción de inversión extranjera directa en el país.",
                  "En primera instancia, se determina que el Índice de Bonos de Mercados Emergentes (EMBI) tiene un efecto significativo y negativo sobre la IED. Esto llega a indicar que una mayor percepción de riesgo país, reflejada en un aumento del EMBI; esto tiende a desincentivar la atracción de inversión extranjera a Costa Rica.",
                 " Seguidamente el modelo reveló que el tipo de cambio de venta del colón costarricense frente al dólar estadounidense tiene un impacto positivo y significativo en la IED. Esto refleja que un tipo de cambio competitivo tendería a atraer una mayor inversión extranjera directa al país. Esto se alinea correctamente con la teoría económica, ya que, un tipo de cambio bueno mejora la competitividad de los productos y servicios ante mercados internacionales.",
                	"En este modelo en forma inicial se incluye la tasa de variación del Producto Interno Bruto (PIB) y la tasa de interés de Estados Unidos como variables explicativas. No obstante, estas variables no demostraron tener significancia sobre la IED. Demostrando de esta forma que el crecimiento económico y la política monetaria estadounidense pueden influir en las decisiones de inversión a nivel global, en el caso particular de Costa Rica, estos factores no parecen ser determinantes clave para la atracción de IED, a corto y mediano plazo. A pesar de esto el peso de estas variables sobre la IED en un poco más complicada que este resultado, ya que la toma de decisión para invertir abrir operaciones en un país es hasta de años.",
                  "Para fines de implementación o diseño de estrategias orientadas a políticas públicas, sería importante incursionar en modelos de “Políticas de crecimiento endógeno a L.P” para describir de una mejor forma la IED de Costa Rica. La barrera que tendría este modelo LM y el modelo de política pública de crecimiento endógeno sería el acceso a los datos; debido a que estas variables son relativamente nuevas y de difícil acceso.",
                ]}
              />
            </section>

            <section id="source-code" className="scroll-mt-28 pt-12">
              <ArticleTitle number="14">Código fuente</ArticleTitle>

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
                      inversion_extranjera_directa.R
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
                  El script completo puede pegarse dentro de la constante
                  sourceCode.
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
                  {["R", "RStudio", "LM", "VAR", "Breusch-Pagan", "VIF"].map(
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
        <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
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
          className={`block h-auto max-h-[720px] w-full rounded-xl bg-white ${
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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 pl-6 text-[17px] leading-8 text-slate-300">
      {items.map((item) => (
        <li key={item} className="list-disc marker:text-indigo-400">
          {item}
        </li>
      ))}
    </ul>
  );
}

function HypothesisCard({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-6">
      <span className="font-mono text-sm text-indigo-300">{label}</span>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
    </div>
  );
}

function DefinitionCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-[15px] leading-7 text-slate-400">{text}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}