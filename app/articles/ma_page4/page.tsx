"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const sourceCode = String.raw`

  #Parte 1. Regresión simple 
  #Librerias 
  library(dynlm)
  library(orcutt)
  library(nlWaldTest)
  library(zoo)
  library(pdfetch)
  library(lmtest)
  library(broom)
  library(PoEdata)
  library(car) 
  library(sandwich)
  library(knitr)
  library(forecast)
  library(readxl)
  library(skimr)
  library(DataExplorer)
  library(dynlm) 
  library(orcutt)
  library(nlWaldTest) 
  library(zoo) )
  library(pdfetch) 
  library(lmtest)
  library(broom) 
  library(PoEdata) 
  library(car) 
  library(sandwich)
  library(knitr) 
  library(forecast)

  #Datos
  data("cps4_small",package="PoEdata")
  View(cps4_small) 
  head(cps4_small)
  names(cps4_small)
  skim(cps4_small)

  #DIMENSIONES DE MATRIZ
  dim(cps4_small) 

  #SUMARY 
  sumary(cps4_small)
  skim(cps4_small) 
  summary(cps4_small)

  #PAKETE DE EXPLORACION DE LA DATA
  plot_str(cps4_small) 

  #datos en la base 
  DataExplorer::plot_str(cps4_small)
  DataExplorer::plot_intro(cps4_small)
  DataExplorer::plot_missing(cps4_small) 

  #Histogramas 
  DataExplorer::plot_histogram(cps4_small$wage)
  DataExplorer::plot_histogram(cps4_small$exper)
  DataExplorer::plot_histogram(cps4_small$educ)

  #funciones densidad 
  DataExplorer::plot_density(cps4_small)

  #Quintiles
  DataExplorer::plot_qq(cps4_small) 

  #MATRIZ DE CORRELACION 
  DataExplorer::plot_correlation(cps4_small) 

  #Regresiones
  Mod01 <- lm(wage~educ+exper+hrswk+married+female+metro+midwest+south+west+black+asian, cps4_small)
  print(Mod01) 
  summary(Mod01)

  Mod02 <- lm(wage~educ+exper+hrswk+married, cps4_small)
  print(Mod02) 
  summary(Mod02)

  Mod03 <- lm(wage~educ+exper+hrswk+married+female+metro, cps4_small) ##mejor
  print(Mod03) 
  summary(Mod03)

  Mod04 <- lm(wage~educ+exper+female+metro, cps4_small)
  print(Mod04) 
  summary(Mod04)

  #Pruebas#
  #Heteroscedasticidad
  # Test Breusch-Pagan 
  bptest(Mod03) 


  #Prueba de normalidad de los errores 
  shapiro.test(residuals(Mod03))   


  #Prueba de autocorrelación (Durbin-Watson)
  durbinWatsonTest(Mod03) 

  #Mayor a 10 fallan prueba de MC-Multicolinealidad 
  vif(Mod03)
`;

const contents = [
  { id: "objective", label: "Objetivo e hipótesis" },
  { id: "description", label: "Descripción del análisis" },
  { id: "variables", label: "Variables del modelo" },
  { id: "exploratory", label: "Análisis exploratorio" },
  { id: "distributions", label: "Densidades y cuantiles" },
  { id: "correlation", label: "Matriz de correlación" },
  { id: "regression", label: "Modelo de regresión" },
  { id: "diagnostics", label: "Pruebas del modelo" },
  { id: "conclusions", label: "Conclusiones" },
  { id: "source-code", label: "Código fuente" },
];

const variableRows = [
  ["wage", "Salario", "Continua"],
  ["educ", "Nivel educativo", "Ordinal"],
  ["exper", "Años de experiencia laboral", "Discreta"],
  ["hrswk", "Horas de trabajo por semana", "Discreta"],
  ["married", "Estado civil", "Binaria"],
  ["female", "Género: mujer o no", "Binaria"],
  ["metro", "Residencia en áreas metropolitanas", "Binaria"],
  ["midwest", "Residencia en la región Medio Oeste", "Binaria"],
  ["south", "Residencia en la región Sur", "Binaria"],
  ["west", "Residencia en la región Oeste", "Binaria"],
  ["black", "Personas de raza negra", "Binaria"],
  ["asian", "Personas de raza asiática", "Binaria"],
];

const descriptiveRows = [
  ["Mínimo", "1.97", "0.0", "2.00", "0.00"],
  ["Primer cuartil", "11.25", "12.0", "16.00", "40.00"],
  ["Mediana", "17.30", "13.0", "27.00", "40.00"],
  ["Media", "20.62", "13.8", "26.51", "39.95"],
  ["Tercer cuartil", "25.63", "16.0", "36.00", "40.00"],
  ["Máximo", "76.39", "21.0", "65.00", "90.00"],
];

const coefficientRows = [
  ["Intercepto", "−14.81451", "2.50931", "−5.904", "4.88e−09", "Significativo"],
  ["educ", "2.02633", "0.13542", "14.963", "< 2e−16", "Significativo"],
  ["exper", "0.13622", "0.02823", "4.825", "1.62e−06", "Significativo"],
  ["hrswk", "0.07979", "0.03561", "2.240", "0.0253", "Significativo"],
  ["married", "1.75934", "0.74816", "2.352", "0.0189", "Significativo"],
  ["female", "−3.98286", "0.73874", "−5.391", "8.74e−08", "Significativo"],
  ["metro", "3.61015", "0.87314", "4.135", "3.86e−05", "Significativo"],
  ["midwest", "−2.29492", "0.89713", "−2.558", "0.0107", "Significativo"],
  ["south", "−1.25134", "0.84901", "−1.474", "0.1408", "No significativo"],
  ["black", "−1.77936", "1.17451", "−1.515", "0.1301", "No significativo"],
];

const diagnosticRows = [
  [
    "Breusch-Pagan",
    "p = 1.367e−06",
    "Se rechaza la hipótesis nula de homocedasticidad. Existe heterocedasticidad en el modelo.",
  ],
  [
    "Shapiro-Wilk",
    "p < 2.2e−16",
    "Se rechaza la hipótesis nula de normalidad. Los residuos no siguen una distribución normal.",
  ],
  [
    "Durbin-Watson",
    "D-W = 2.035",
    "No se identifica evidencia de autocorrelación en los residuos.",
  ],
  [
    "Factor de Inflación de la Varianza",
    "VIF sin valores problemáticos",
    "No se observan problemas significativos de multicolinealidad entre las variables predictoras.",
  ],
];

export default function SalaryRegressionArticle() {
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
              href="/projects/modelo04"
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
            <span className="text-sm text-slate-500">
              Métodos cuantitativos de banca
            </span>
          </div>

          <h1 className="max-w-5xl text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Modelo econométrico de los determinantes del salario
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">
            Análisis mediante regresión lineal de la relación entre el salario,
            la educación, la experiencia, las horas trabajadas y distintas
            características sociodemográficas.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span>
              Autor:{" "}
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
                  El objetivo general consiste en analizar la relación entre el
                  salario y las variables independientes seleccionadas, con el
                  fin de comprender cómo estas características afectan la
                  obtención de un mejor salario.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <HypothesisCard
                    label="H₀"
                    title="Hipótesis nula"
                    text="Las variables independientes seleccionadas no tienen un efecto significativo sobre el salario."
                  />
                  <HypothesisCard
                    label="Ha"
                    title="Hipótesis alternativa"
                    text="Las variables independientes seleccionadas poseen un efecto significativo sobre el salario."
                  />
                </div>
              </div>
            </section>

            <section
              id="description"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="02">
                Descripción del análisis
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El salario es una compensación financiera que recibe una
                  persona a cambio de su trabajo, considerando elementos como
                  las horas laboradas, el tipo de ocupación y el nicho
                  profesional. Constituye una medida relevante tanto en
                  economía como en sociología, porque refleja el valor del
                  trabajo y se relaciona con el nivel de vida, el desarrollo
                  socioeconómico y la desigualdad económica.
                </p>

                <p>
                  Con el paso del tiempo se ha observado que una amplia variedad
                  de factores puede influir sobre el salario percibido. Estos
                  efectos pueden variar según la ubicación, la industria, la
                  cultura y las condiciones económicas y sociales.
                </p>

                <blockquote className="border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  Debido a que la base de datos no especifica la moneda en la
                  que se expresa el salario, el estudio utiliza la denominación
                  “unidad monetaria” (um).
                </blockquote>

                <p>
                  El documento señala que las variables se encuentran de forma
                  trimestral y comprenden desde el primer trimestre de 1984
                  hasta el cuarto trimestre de 2009.
                </p>
              </div>
            </section>

            <section
              id="variables"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="03">Variables del modelo</ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                La base incorpora una variable dependiente continua y distintas
                variables explicativas ordinales, discretas y binarias.
              </p>

              <DataTable
                title="Tabla 1. Descripción de variables"
                headers={["Variable", "Descripción", "Tipo de dato"]}
                rows={variableRows}
                caption="Fuente: elaboración propia con el programa RStudio."
              />
            </section>

            <section
              id="exploratory"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="04">
                Resumen exploratorio
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El resumen descriptivo se concentra en las variables no
                  binarias del modelo: salario, educación, experiencia y horas
                  trabajadas por semana.
                </p>
              </div>

              <div className="mt-8">
                <DataTable
                  title="Tabla 2. Resumen exploratorio de variables no binarias"
                  headers={["Estadístico", "wage", "educ", "exper", "hrswk"]}
                  rows={descriptiveRows}
                  caption="Fuente: elaboración propia con el programa RStudio."
                />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Salario medio" value="20.62 um" />
                <MetricCard label="Educación media" value="13.8" />
                <MetricCard label="Experiencia media" value="26.51 años" />
                <MetricCard label="Horas semanales" value="39.95" />
              </div>
            </section>

            <section
              id="distributions"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="05">
                Gráficos de densidad y cuantiles
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Los gráficos de densidad permiten observar la forma de la
                distribución de cada variable, mientras que los gráficos de
                cuantiles comparan sus observaciones con una distribución de
                referencia. En las densidades, el eje vertical representa la
                densidad y el eje horizontal el valor de la variable.
              </p>

              <div className="space-y-10">
                <DistributionPair
                  title="Nivel educativo (educ)"
                  densityImage="/images/salary-regression/educacion-densidad.png"
                  densityAlt="Gráfico de densidad del nivel educativo"
                  quantileImage="/images/salary-regression/educacion-cuantiles.png"
                  quantileAlt="Gráfico de cuantiles del nivel educativo"
                />

                <DistributionPair
                  title="Experiencia laboral (exper)"
                  densityImage="/images/salary-regression/experiencia-densidad.png"
                  densityAlt="Gráfico de densidad de la experiencia laboral"
                  quantileImage="/images/salary-regression/experiencia-cuantiles.png"
                  quantileAlt="Gráfico de cuantiles de la experiencia laboral"
                />

                <DistributionPair
                  title="Horas trabajadas por semana (hrswk)"
                  densityImage="/images/salary-regression/horas-densidad.png"
                  densityAlt="Gráfico de densidad de las horas trabajadas"
                  quantileImage="/images/salary-regression/horas-cuantiles.png"
                  quantileAlt="Gráfico de cuantiles de las horas trabajadas"
                />

                <DistributionPair
                  title="Salario (wage)"
                  densityImage="/images/salary-regression/salario-densidad.png"
                  densityAlt="Gráfico de densidad del salario"
                  quantileImage="/images/salary-regression/salario-cuantiles.png"
                  quantileAlt="Gráfico de cuantiles del salario"
                />
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-slate-500">
                Fuente: elaboración propia con el programa RStudio.
              </p>
            </section>

            <section
              id="correlation"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="06">
                Matriz de correlación
              </ArticleTitle>

              <FigureCard
                image="/images/salary-regression/matriz-correlacion.png"
                title="Figura 1. Matriz de correlación"
                alt="Matriz de correlación de las variables del modelo salarial"
                source="Fuente: elaboración propia con el programa RStudio."
                objectFit="contain"
                heightClass="min-h-[320px] sm:min-h-[560px]"
              />

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  La matriz presenta las correlaciones entre todas las variables
                  incluidas en el análisis. Según la interpretación del estudio,
                  las relaciones lineales observadas son reducidas y, a simple
                  vista, no sugieren problemas graves de correlación dentro del
                  modelo de regresión.
                </p>
              </div>
            </section>

            <section
              id="regression"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="07">
                Modelo de regresión lineal
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Se revisó la significancia de las variables y se excluyó
                  “asian”, debido a que no aportaba significancia ni funcionaba
                  como variable estabilizadora. Las variables “black” y
                  “south” permanecieron en el modelo porque, aunque no son
                  individualmente significativas, funcionan como
                  estabilizadoras y aumentan el R².
                </p>
              </div>

              <div className="mt-8">
                <FigureCard
                  image="/images/salary-regression/modelo-regresion.png"
                  title="Figura 2. Resultado del modelo de regresión"
                  alt="Salida en RStudio del modelo de regresión salarial"
                  source="Fuente: elaboración propia con el programa RStudio."
                  objectFit="contain"
                  heightClass="min-h-[300px] sm:min-h-[500px]"
                />
              </div>

              <div className="mt-10">
                <DataTable
                  title="Coeficientes estimados"
                  headers={[
                    "Variable",
                    "Coeficiente",
                    "Error estándar",
                    "Estadístico t",
                    "p-value",
                    "Resultado",
                  ]}
                  rows={coefficientRows}
                  caption="Fuente: elaboración propia a partir de la salida del modelo en RStudio."
                />
              </div>

              <div className="mt-10 space-y-6 text-[17px] leading-8 text-slate-300">
                <InterpretationCard
                  title="Intercepto"
                  text="El coeficiente de −14.81 indica que, cuando todas las variables predictoras son iguales a cero, el salario esperado sería aproximadamente −14.81 unidades monetarias."
                />
                <InterpretationCard
                  title="Nivel educativo"
                  text="Por cada unidad adicional en el nivel educativo, el salario aumenta en promedio 2.03 unidades monetarias, manteniendo constantes las demás variables."
                />
                <InterpretationCard
                  title="Experiencia laboral"
                  text="Cada año adicional de experiencia se asocia con un aumento promedio de 0.14 unidades monetarias en el salario."
                />
                <InterpretationCard
                  title="Horas trabajadas"
                  text="Cada hora adicional trabajada por semana se relaciona con un incremento promedio de 0.08 unidades monetarias."
                />
                <InterpretationCard
                  title="Estado civil"
                  text="Estar casado se asocia con un salario promedio 1.76 unidades monetarias mayor que el de las personas no casadas."
                />
                <InterpretationCard
                  title="Género"
                  text="Ser mujer se asocia con una reducción promedio de 3.98 unidades monetarias respecto de los hombres, manteniendo constantes las demás características."
                />
                <InterpretationCard
                  title="Área metropolitana"
                  text="Vivir en una zona metropolitana se relaciona con un aumento promedio de 3.61 unidades monetarias frente a las zonas no metropolitanas."
                />
                <InterpretationCard
                  title="Región Medio Oeste"
                  text="Residir en la región Medio Oeste se asocia con una disminución promedio de 2.29 unidades monetarias respecto de las demás regiones."
                />
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="R²" value="0.2577" />
                <MetricCard label="R² ajustado" value="0.2509" />
                <MetricCard label="Error estándar residual" value="11.11" />
                <MetricCard label="Estadístico F" value="38.18" />
              </div>

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El R² indica que aproximadamente el 25.77 % de la variabilidad
                  del salario puede explicarse mediante las variables incluidas
                  en el modelo. El R² ajustado es de 25.09 %, ligeramente menor
                  que el R² estándar.
                </p>

                <p>
                  Esta diferencia sugiere que la inclusión de “south” y “black”
                  no mejora de manera importante la capacidad predictiva, aunque
                  el estudio las conserva como variables estabilizadoras.
                </p>

                <p>
                  El estadístico F alcanza 38.18 y presenta un p-value inferior
                  a 2.2e−16. Por tanto, el modelo es globalmente significativo
                  al nivel del 5 %.
                </p>

                <p>
                  El error estándar residual de 11.11 indica que las
                  predicciones se encuentran, en promedio, aproximadamente a
                  11.11 unidades monetarias del salario observado.
                </p>
              </div>
            </section>

            <section
              id="diagnostics"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="08">
                Pruebas de diagnóstico
              </ArticleTitle>

              <DataTable
                headers={["Prueba", "Resultado", "Interpretación"]}
                rows={diagnosticRows}
                caption="Resultados reportados en el análisis econométrico."
              />

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  La prueba de Breusch-Pagan evidencia que la varianza de los
                  errores no es constante. Esta heterocedasticidad puede afectar
                  la precisión de los errores estándar y la inferencia sobre los
                  coeficientes.
                </p>

                <p>
                  El estudio propone explorar alternativas como regresión
                  ponderada, mínimos cuadrados generalizados o modelos para la
                  varianza condicional de los errores, como ARCH o GARCH.
                </p>

                <p>
                  La prueba de Shapiro-Wilk también identifica una violación del
                  supuesto de normalidad. En contraste, Durbin-Watson no muestra
                  evidencia de autocorrelación y el VIF no señala
                  multicolinealidad significativa.
                </p>
              </div>
            </section>

            <section
              id="conclusions"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="09">Conclusiones</ArticleTitle>

              <BulletList
                items={[
                  "El modelo muestra que ciertas características socioeconómicas, como el nivel educativo, la experiencia laboral, las horas trabajadas por semana, el estado civil, el género y la ubicación geográfica, tienen un impacto significativo en el salario de un individuo. Esto destaca la importancia de considerar estos factores al abordar las disparidades salariales y promover la igualdad de oportunidades en el mercado laboral.",
                  "El coeficiente negativo asociado con la variable 'female' indica que las mujeres ganan menos que los hombres, incluso después de tener en cuenta otros factores. Este hallazgo respalda la existencia de la brecha salarial de género y destaca la necesidad de abordar las barreras.",
                  "A pesar de que el modelo es significativo de forma general, existe evidencia de heterocedasticidad y falta de normalidad en los residuos, lo que viola algunos supuestos importantes del modelo de regresión lineal. La violación de estos supuestos determinantes muestra la necesidad de explorar modelos o tratamientos alternativos, como modelos de regresión ponderados o métodos de mínimos cuadrados generalizados, para obtener estimaciones más precisas y confiables.",
                ]}
              />
            </section>

            <section id="source-code" className="scroll-mt-28 pt-12">
              <ArticleTitle number="11">Código fuente</ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Este apartado queda preparado para incorporar posteriormente el
                script completo utilizado en la estimación del modelo.
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
                      modelo_salario.R
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
                  Desplácese dentro de este recuadro para consultar el script completo.
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
                  Herramientas
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["RStudio", "Regresión lineal", "Breusch-Pagan", "VIF"].map(
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
  heightClass?: string;
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

type DistributionPairProps = {
  title: string;
  densityImage: string;
  densityAlt: string;
  quantileImage: string;
  quantileAlt: string;
};

function DistributionPair({
  title,
  densityImage,
  densityAlt,
  quantileImage,
  quantileAlt,
}: DistributionPairProps) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-white">{title}</h3>

      <div className="grid gap-4 md:grid-cols-2">
        <MiniFigure
          image={densityImage}
          alt={densityAlt}
          label="Densidad"
        />

        <MiniFigure
          image={quantileImage}
          alt={quantileAlt}
          label="Cuantiles"
        />
      </div>
    </div>
  );
}

function MiniFigure({
  image,
  alt,
  label,
}: {
  image: string;
  alt: string;
  label: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-[#07101f] p-3 shadow-lg shadow-black/20">
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className="block h-auto max-h-[420px] w-full rounded-xl bg-white object-contain"
      />

      <figcaption className="pt-3 text-center text-xs text-slate-500">
        {label}
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

function InterpretationCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
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