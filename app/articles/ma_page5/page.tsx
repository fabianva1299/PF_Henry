"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const sourceCode = String.raw`
  install.packages("reshape2")

  # Cargar librerías necesarias
  library(ggplot2)
  library(reshape2)

  #   Datos 
  data <- data.frame(
    Fecha = c("nov-24", "oct-24", "sept-24", "ago-24", "jul-24", "jun-24", "may-24",
              "abr-24", "mar-24", "feb-24", "ene-24", "dic-23", "nov-23", "oct-23",
              "sept-23", "ago-23", "jul-23", "jun-23", "may-23", "abr-23", "mar-23",
              "feb-23", "ene-23"),
    Precio = c(70.15, 71.99, 70.24, 76.68, 81.8, 79.77, 80.02, 85.35, 81.28, 77.25,
              74.15, 71.9, 77.69, 85.64, 89.43, 81.39, 76.07, 70.25, 71.58, 79.45,
              73.28, 76.83, 78.12)
  )

  # Fechas
  month_translation <- c("ene" = "Jan", "feb" = "Feb", "mar" = "Mar", "abr" = "Apr",
                        "may" = "May", "jun" = "Jun", "jul" = "Jul", "ago" = "Aug",
                        "sept" = "Sep", "oct" = "Oct", "nov" = "Nov", "dic" = "Dec")

  # Reemplazo de meses 
  for (mes in names(month_translation)) {
    data$Fecha <- gsub(mes, month_translation[[mes]], data$Fecha)
  }

  # Fechas en formato correcto
  data$Fecha <- as.Date(paste("01", data$Fecha), format = "%d %b-%y")

  # Ordenar los datos por fecha
  data <- data[order(data$Fecha), ]

  # Calculo de los rendimientos logarítmicos
  data$Log_Return <- c(NA, diff(log(data$Precio)))

  # Parámetros históricos
  mean_return <- mean(data$Log_Return, na.rm = TRUE)
  volatility <- sd(data$Log_Return, na.rm = TRUE)

  # Simulación Monte Carlo
  set.seed(42)  # Para reproducibilidad
  n_simulations <- 1000 #Cantidad de iteraciones
  n_months <- 6  # Extender a 6 meses
  current_price <- tail(data$Precio, 1)

  # Simulaciones
  simulated_prices <- matrix(0, nrow = n_months, ncol = n_simulations)
  simulated_prices[1, ] <- current_price * exp((mean_return - 0.5 * volatility^2) +
                                                volatility * rnorm(n_simulations))
  for (t in 2:n_months) {
    simulated_prices[t, ] <- simulated_prices[t - 1, ] * exp((mean_return - 0.5 * volatility^2) +
                                                              volatility * rnorm(n_simulations))
  }

  # Calculo de percentiles para los primeros 3 meses y los primeros 6 meses
  percentiles <- c(0.25, 0.5, 0.75, 0.9)
  results <- data.frame(
    Month = 1:n_months,
    t(sapply(1:n_months, function(t) quantile(simulated_prices[t, ], probs = percentiles)))
  )
  colnames(results)[-1] <- paste0("P", percentiles * 100)

  # Resultados para los primeros 3 y 6 meses
  cat("Proyección de precios para los primeros 3 meses:\n")
  print(results[1:3, ])

  cat("\nProyección de precios para los primeros 6 meses:\n")
  print(results) 

  # Cálculo de percentiles para el gráfico de abanico
  percentiles <- c(0.05, 0.25, 0.5, 0.75, 0.95)  # Percentiles 5%, 25%, 50%, 75%, 95%
  fan_chart_data <- data.frame(
    Month = 1:n_months,
    t(sapply(1:n_months, function(t) quantile(simulated_prices[t, ], probs = percentiles)))
  )
  colnames(fan_chart_data)[-1] <- paste0("P", percentiles * 100)

  # Crear gráfico de abanico para 3 y 6 meses
  create_fan_chart <- function(data, months, title) {
    data_filtered <- data[1:months, ]  # Filtrar los datos para los meses que quiero 
    ggplot(data_filtered, aes(x = Month)) +
      geom_ribbon(aes(ymin = P5, ymax = P95), fill = "blue", alpha = 0.1) +  # Banda 90%
      geom_ribbon(aes(ymin = P25, ymax = P75), fill = "blue", alpha = 0.3) + # Banda 50%
      geom_line(aes(y = P50), color = "red", size = 1) +                    # Línea mediana
      labs(
        title = title,
        x = "Meses",
        y = "Precio por barril($)"
      ) +
      theme_minimal()
  }

  # Gráfico para 3 meses
  fan_chart_3_months <- create_fan_chart(fan_chart_data, 3, "SimulaciÓn Monte Carlo Precios del Crudo WTI - 3 Meses")
  print(fan_chart_3_months)

  # Gráfico para 6 meses
  fan_chart_6_months <- create_fan_chart(fan_chart_data, 6, "SimulaciÓn Monte Carlo Precios del Crudo WTI - 6 Meses")
  print(fan_chart_6_months)
`;

const contents = [
  { id: "overview", label: "Descripción general" },
  { id: "model-purpose", label: "Objetivo del modelo" },
  { id: "percentiles", label: "Percentiles proyectados" },
  { id: "three-months", label: "Proyección a tres meses" },
  { id: "six-months", label: "Proyección a seis meses" },
  { id: "fan-charts", label: "Gráficos de abanico" },
  { id: "risk-management", label: "Aplicación en cobertura" },
  { id: "conclusions", label: "Conclusiones" },
  { id: "source-code", label: "Código fuente" },
];

const percentileRows = [
  ["1", "73.56620", "77.81242", "82.40709", "86.84417"],
  ["2", "71.57662", "77.55719", "83.81294", "90.26820"],
  ["3", "69.96182", "77.09810", "84.88394", "93.31320"],
  ["4", "68.65693", "76.93041", "86.39946", "95.29297"],
  ["5", "67.47574", "76.41733", "87.49276", "98.30494"],
  ["6", "66.16993", "76.93577", "87.93643", "100.91469"],
];

const horizonComparisonRows = [
  [
    "Mes 1",
    "73.57",
    "77.81",
    "82.41",
    "86.84",
    "8.84",
  ],
  [
    "Mes 3",
    "69.96",
    "77.10",
    "84.88",
    "93.31",
    "14.92",
  ],
  [
    "Mes 6",
    "66.17",
    "76.94",
    "87.94",
    "100.91",
    "21.77",
  ],
];

export default function WtiMonteCarloArticle() {
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
              href="/projects/modelo05"
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
              Ingeniería financiera
            </span>
            <span className="text-sm text-slate-500">
              Modelo probabilístico
            </span>
          </div>

          <h1 className="max-w-5xl text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Simulación Monte Carlo del precio del petróleo WTI
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">
            Modelo de proyección probabilística a tres y seis meses para
            representar la incertidumbre del precio del crudo y evaluar
            escenarios aplicables a una estrategia de cobertura mediante un
            swap de petróleo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span>
              Autor:{" "}
              <strong className="font-medium text-slate-300">
                Henry Alvarado Vargas
              </strong>
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>Monte Carlo en RStudio</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>WTI</span>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
          <article className="min-w-0">
            <section
              id="overview"
              className="scroll-mt-28 border-b border-white/10 pb-12"
            >
              <ArticleTitle number="01">
                Descripción general
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El proyecto desarrolla un modelo de proyección de precios del
                  petróleo West Texas Intermediate, WTI, mediante simulación
                  Monte Carlo, con horizontes de análisis de tres y seis meses.
                </p>

                <p>
                  A diferencia de una proyección tradicional que presenta un
                  único precio esperado, el modelo genera miles de posibles
                  escenarios. Los resultados se resumen mediante percentiles,
                  permitiendo observar tanto el comportamiento central de la
                  simulación como escenarios favorables y adversos.
                </p>

                <p>
                  Esta estructura resulta especialmente útil para un activo como
                  el petróleo, cuyo precio puede registrar variaciones
                  importantes durante períodos relativamente cortos.
                </p>

                <blockquote className="border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  La proyección funciona como complemento del análisis de
                  mercado. Sus resultados deben interpretarse conjuntamente
                  con el análisis técnico, las condiciones del mercado y las
                  presiones que puedan influir en el comportamiento del precio.
                </blockquote>
              </div>
            </section>

            <section
              id="model-purpose"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="02">
                Objetivo del modelo
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El objetivo principal consiste en representar la
                  incertidumbre asociada con la evolución futura del precio del
                  crudo y convertirla en escenarios cuantificables que puedan
                  utilizarse para evaluar una estrategia de cobertura mediante
                  un swap de petróleo.
                </p>

                <p>
                  El modelo no busca afirmar cuál será exactamente el precio
                  futuro. Su propósito es establecer un rango de resultados
                  posibles y mostrar cómo aumenta la incertidumbre conforme se
                  amplía el horizonte de proyección.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Horizonte corto" value="3 meses" />
                <MetricCard label="Horizonte ampliado" value="6 meses" />
                <MetricCard label="Trayectoria central" value="P50" />
                <MetricCard label="Escenario superior" value="P90" />
              </div>
            </section>

            <section
              id="percentiles"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="03">
                Percentiles de la distribución proyectada
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Los resultados principales se presentan mediante los
                  percentiles 25, 50, 75 y 90. El percentil 50 representa la
                  mediana de las simulaciones y funciona como trayectoria
                  central.
                </p>

                <BulletList
                  items={[
                    "P25: escenario de precios relativamente bajos.",
                    "P50: trayectoria central o mediana de la simulación.",
                    "P75: escenario de precios superiores a la mediana.",
                    "P90: escenario alto y de mayor variación.",
                  ]}
                />
              </div>

              <div className="mt-8">
                <DataTable
                  title="Figura 1. Percentiles proyectados por horizonte mensual"
                  headers={["Mes", "P25", "P50", "P75", "P90"]}
                  rows={percentileRows}
                  caption="Valores expresados en dólares estadounidenses por barril."
                />
              </div>
            </section>

            <section
              id="three-months"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="04">
                Proyección a tres meses
              </ArticleTitle>

              <FigureCard
                image="/images/wti-monte-carlo/proyeccion-tres-meses.png"
                title="Figura 2. Proyección probabilística del precio del petróleo WTI a tres meses"
                alt="Gráfico de abanico de la proyección del precio WTI a tres meses"
                source="Fuente: elaboración propia mediante simulación Monte Carlo en RStudio."
                objectFit="contain"
                heightClass="min-h-[300px] sm:min-h-[460px]"
              />

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  La línea roja representa la trayectoria central,
                  correspondiente aproximadamente al percentil 50. Esta se
                  mantiene relativamente estable, al pasar de USD 77.81 por
                  barril durante el primer mes a USD 77.10 en el tercero.
                </p>

                <p>
                  La simulación no identifica una tendencia central fuertemente
                  alcista o bajista durante el corto plazo. Sin embargo, las
                  bandas se amplían progresivamente, mostrando que la dispersión
                  entre los escenarios simulados aumenta conforme transcurre el
                  tiempo.
                </p>

                <p>
                  Durante el primer mes, el P25 se sitúa en USD 73.57 y el P75
                  en USD 82.41, generando un intervalo central cercano a USD
                  8.84 por barril. En el tercer mes, este intervalo alcanza
                  aproximadamente USD 14.92, con un P25 de USD 69.96 y un P75
                  de USD 84.88.
                </p>

                <p>
                  El P90 aumenta desde USD 86.84 durante el primer mes hasta USD
                  93.31 en el tercero. Por tanto, aunque la mediana se mantiene
                  alrededor de USD 77, el modelo contempla movimientos
                  considerablemente más altos.
                </p>

                <blockquote className="border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  El principal resultado del horizonte de tres meses no es una
                  variación importante de la mediana, sino el crecimiento de la
                  incertidumbre alrededor de esa trayectoria central.
                </blockquote>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MetricCard label="P50 mes 3" value="USD 77.10" />
                <MetricCard label="P75 mes 3" value="USD 84.88" />
                <MetricCard label="P90 mes 3" value="USD 93.31" />
              </div>
            </section>

            <section
              id="six-months"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="05">
                Proyección a seis meses
              </ArticleTitle>

              <FigureCard
                image="/images/wti-monte-carlo/proyeccion-seis-meses.png"
                title="Figura 3. Proyección probabilística del precio del petróleo WTI a seis meses"
                alt="Gráfico de abanico de la proyección del precio WTI a seis meses"
                source="Fuente: elaboración propia mediante simulación Monte Carlo en RStudio."
                objectFit="contain"
                heightClass="min-h-[300px] sm:min-h-[460px]"
              />

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El gráfico de seis meses conserva la misma estructura, pero
                  presenta una expansión más pronunciada de las bandas de
                  incertidumbre.
                </p>

                <p>
                  La mediana continúa relativamente estable: pasa de USD 77.81
                  durante el primer mes a USD 76.94 al finalizar el sexto. La
                  reducción es inferior a un dólar por barril, por lo que el
                  escenario central continúa señalando estabilidad alrededor de
                  los USD 77.
                </p>

                <p>
                  Las trayectorias alternativas se separan de manera
                  importante. Durante el sexto mes, el P25 alcanza USD 66.17 y
                  el P75 llega a USD 87.94. El intervalo central se amplía hasta
                  aproximadamente USD 21.77 por barril, más del doble de la
                  amplitud del primer mes.
                </p>

                <p>
                  El P90 alcanza USD 100.91, mostrando que algunos escenarios
                  simulados contemplan precios superiores a USD 100 por barril.
                  Simultáneamente, el P25 se encuentra cerca de USD 11 por
                  debajo de la mediana.
                </p>

                <blockquote className="border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  Una proyección central estable no implica que el riesgo sea
                  reducido. El precio esperado puede permanecer cerca del nivel
                  actual mientras existe una amplia distribución de escenarios
                  a su alrededor.
                </blockquote>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MetricCard label="P25 mes 6" value="USD 66.17" />
                <MetricCard label="P50 mes 6" value="USD 76.94" />
                <MetricCard label="P90 mes 6" value="USD 100.91" />
              </div>
            </section>

            <section
              id="fan-charts"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="06">
                Interpretación de los gráficos de abanico
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  La principal fortaleza visual de estos gráficos es que
                  presentan simultáneamente la estimación central, la dispersión
                  de los resultados y la evolución temporal del riesgo.
                </p>

                <p>
                  La línea roja permite identificar el comportamiento típico de
                  la simulación. Las bandas más oscuras muestran escenarios
                  relativamente cercanos a la mediana, mientras que las áreas
                  más claras representan resultados más alejados y de mayor
                  variación.
                </p>

                <p>
                  El modelo muestra una trayectoria central estable cercana a
                  USD 77 por barril, acompañada de un crecimiento sostenido de
                  la incertidumbre.
                </p>
              </div>

              <div className="mt-8">
                <DataTable
                  title="Comparación del crecimiento de la incertidumbre"
                  headers={[
                    "Horizonte",
                    "P25",
                    "P50",
                    "P75",
                    "P90",
                    "Amplitud P25-P75",
                  ]}
                  rows={horizonComparisonRows}
                  caption="Valores aproximados en dólares estadounidenses por barril."
                />
              </div>
            </section>

            <section
              id="risk-management"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="07">
                Aplicación en la evaluación del swap
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Desde la perspectiva de gestión de riesgos, el P75 del tercer
                  mes, equivalente a USD 84.88, se utiliza como referencia para
                  representar un escenario favorable de aumento del precio del
                  petróleo.
                </p>

                <p>
                  Este resultado permite analizar el comportamiento financiero
                  del swap cuando el precio flotante se encuentra por encima del
                  precio fijo pactado.
                </p>

                <p>
                  Para el horizonte de seis meses se utiliza el P25, cercano a
                  USD 66.16, como escenario conservador. Este nivel permite
                  analizar las consecuencias de una caída del mercado y
                  contrastarlas con el escenario de incremento del tercer mes.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <ScenarioCard
                    title="Escenario de aumento"
                    value="USD 84.88"
                    label="P75 del tercer mes"
                    text="Permite evaluar el swap cuando el precio flotante supera el precio fijo."
                  />
                  <ScenarioCard
                    title="Escenario conservador"
                    value="USD 66.16"
                    label="P25 del sexto mes"
                    text="Permite evaluar el efecto de una caída del precio del petróleo."
                  />
                </div>
              </div>
            </section>

            <section
              id="conclusions"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="08">
                Conclusiones
              </ArticleTitle>

              <BulletList
                items={[
                  "La trayectoria central del precio WTI permanece estable cerca de USD 77 por barril en los horizontes de tres y seis meses.",
                  "La incertidumbre aumenta conforme se amplía el horizonte, aun cuando la mediana presenta pocas variaciones.",
                  "El intervalo entre P25 y P75 pasa de aproximadamente USD 8.84 en el primer mes a USD 14.92 en el tercero y USD 21.77 en el sexto.",
                  "El P90 del sexto mes supera los USD 100 por barril, evidenciando la existencia de escenarios altos dentro de la distribución.",
                  "Los gráficos de abanico permiten diferenciar claramente entre tendencia central y dispersión del riesgo.",
                  "Las decisiones de cobertura no deben apoyarse exclusivamente en el precio medio o esperado, sino también en la distribución de escenarios adversos y favorables.",
                  "El P75 del tercer mes y el P25 del sexto mes aportan referencias diferenciadas para evaluar el swap ante movimientos del precio en ambas direcciones.",
                  "La simulación debe complementarse con análisis técnico, condiciones de mercado y presiones económicas relevantes.",
                ]}
              />
            </section>

            <section id="source-code" className="scroll-mt-28 pt-12">
              <ArticleTitle number="09">
                Código fuente
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Este apartado queda preparado para incorporar posteriormente el
                script completo utilizado en la simulación Monte Carlo.
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
                      simulacion_wti.R
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
                  {[
                    "RStudio",
                    "Monte Carlo",
                    "WTI",
                    "Percentiles",
                    "Swap",
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

function ScenarioCard({
  title,
  value,
  label,
  text,
}: {
  title: string;
  value: string;
  label: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-indigo-400/15 bg-indigo-400/[0.05] p-6">
      <p className="text-xs uppercase tracking-[0.14em] text-indigo-300">
        {title}
      </p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
      <p className="mt-4 text-sm leading-7 text-slate-400">{text}</p>
    </div>
  );
}