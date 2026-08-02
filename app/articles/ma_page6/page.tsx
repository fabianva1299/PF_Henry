"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

const sourceCode = String.raw`
  #var librerias 
  library(tseries) 
  library(dynlm) 
  library(vars)
  library(nlWaldTest)  
  library(lmtes) 
  library(broom)
  library(PoEdata)
  library(car)
  library(sandwich)
  library(knitr)
  library(forecast)
  rm(list=ls())
  library(PoEdata) 

  data("gdp",package="PoEdata")
  View(gdp) 
  head(gdp)
  names(gdp)
  skim(gdp) 

  #Serie de tiempo
  VAR1 <- ts(gdp, start=c(1970,1),end=c(2000,4),frequency=4)
  print(VAR1) 
  summary(VAR1) 
  ts.plot(VAR1[,"usa"],VAR1[,"aus"], type="l",lty=c(1,2), col=c(1,2))
  legend("topleft", border=NULL, legend=c("usa","aus"),lty=c(1,2), col=c(1,2)) 

  #Evaluar estacionariedad y cointegracion
  #Graficar
  acf(VAR1[,"usa"],plot=TRUE) 
  acf(VAR1[,"aus"],plot=TRUE) 

  #Prueba estacionariedad
  adf.test(VAR1[,"usa"]) 
  adf.test(VAR1[,"aus"])

  #Crear las diferencias
  dusa<-diff(VAR1[,"usa"])
  daus<-diff(VAR1[,"aus"])
  
  #Graficar DIFERENCIAS 
  ts.plot(dusa,daus, type="l",lty=c(1,2), col=c(1,2))
  ts.plot(dusa,daus, type="l",lty=c(1,2), col=c(1,2))

  #rezagos optimos
  acf(dusa,plot=TRUE)
  acf(daus,plot=TRUE) 

  #pRUEBA DIKE FULLER
  adf.test(dusa)
  adf.test(daus)

  #Estacionarias en diferencias, cointegracion  en este caso si son integradas en niveles origeniales 
  cointcy <- dynlm(usa~aus, gdp) 
  ehat <- resid(cointcy) 
  adf.test(ehat)            

  #Modelo VAR en niveles originales
  Vusa <- (VAR1[,"usa"])
  Vaus <- (VAR1[,"aus"])
  varmat <- as.matrix(cbind(Vusa,Vaus))
  varfit <- VAR(varmat, p = 2, type = "const")
  summary(varfit)

  #Impulso respuesta, con intervalo de confianza
  impresp <- irf(varfit)
  plot(impresp)
  plot(fevd(varfit)) 
`;

const contents = [
  { id: "overview", label: "Descripción general" },
  { id: "series", label: "Evolución de las series" },
  { id: "model", label: "Especificación VAR" },
  { id: "vusa-equation", label: "Ecuación para Vusa" },
  { id: "vaus-equation", label: "Ecuación para Vaus" },
  { id: "impulse-response", label: "Impulso-respuesta" },
  { id: "conclusions", label: "Conclusiones" },
  { id: "source-code", label: "Código fuente" },
];

const vusaRows = [
  ["Vusa.l1", "1.21558", "0.09882", "12.301", "< 2e−16", "Significativo"],
  ["Vaus.l1", "0.03295", "0.08282", "0.398", "0.6915", "No significativo"],
  ["Vusa.l2", "−0.22861", "0.10239", "−2.233", "0.0275", "Significativo"],
  ["Vaus.l2", "−0.01320", "0.08132", "−0.162", "0.8713", "No significativo"],
  ["Constante", "−0.01926", "0.17554", "−0.110", "0.9128", "No significativo"],
];

const vausRows = [
  ["Vusa.l1", "0.338980", "0.123065", "2.754", "0.00682", "Significativo"],
  ["Vaus.l1", "0.870053", "0.103142", "8.436", "≈ 1e−13", "Significativo"],
  ["Vusa.l2", "−0.206477", "0.127514", "−1.619", "0.10809", "No significativo"],
  ["Vaus.l2", "0.006228", "0.101269", "0.062", "0.95106", "No significativo"],
  ["Constante", "−0.286976", "0.218606", "−1.313", "0.19183", "No significativo"],
];

const modelSummaryRows = [
  ["Ecuación Vusa", "0.4858", "0.9992", "0.9992", "3.892e+04", "< 2.2e−16"],
  ["Ecuación Vaus", "0.6049", "0.9988", "0.9988", "2.534e+04", "< 2.2e−16"],
];

const impulseRows = [
  [
    "Impulso en Vusa → respuesta de Vusa",
    "Positiva y persistente",
    "El efecto aumenta al inicio, después se estabiliza y permanece positivo durante los períodos observados.",
  ],
  [
    "Impulso en Vusa → respuesta de Vaus",
    "Positiva y creciente",
    "La respuesta de Australia aumenta con el tiempo, aunque los intervalos se amplían y reducen la certeza.",
  ],
  [
    "Impulso en Vaus → respuesta de Vusa",
    "Pequeña y poco concluyente",
    "El intervalo de confianza se expande e incluye el cero, por lo que el efecto no se considera estadísticamente claro.",
  ],
  [
    "Impulso en Vaus → respuesta de Vaus",
    "Positiva y decreciente",
    "Australia responde positivamente a su propio impulso, pero el efecto pierde intensidad conforme avanza el horizonte.",
  ],
];

export default function VarUsaAustraliaArticle() {
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
              href="/projects/modelo06"
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
              Series de tiempo
            </span>
            <span className="text-sm text-slate-500">
              Modelo de vectores autorregresivos
            </span>
          </div>

          <h1 className="max-w-5xl text-4xl font-bold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            Modelo VAR del PIB de Estados Unidos y Australia
          </h1>

          <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-400">
            Análisis de la dinámica conjunta, los rezagos y las respuestas ante
            impulsos del producto interno bruto de Estados Unidos y Australia
            durante el período 1970-2000.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
            <span>PIB de Estados Unidos y Australia</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>1970-2000</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 sm:block" />
            <span>Elaboración en RStudio</span>
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
                  El análisis utiliza un modelo de vectores autorregresivos,
                  VAR, para estudiar la evolución conjunta del PIB de Estados
                  Unidos y Australia.
                </p>

                <p>
                  Ambas variables presentan una tendencia creciente durante el
                  período analizado. El documento plantea que podría existir una
                  relación causal asociada con los vínculos comerciales entre
                  ambos países y con la influencia que ejerce el crecimiento de
                  Estados Unidos sobre otras economías dentro de un contexto de
                  globalización.
                </p>

                <blockquote className="border-l-2 border-indigo-400 bg-indigo-400/[0.06] px-6 py-5 text-slate-300">
                  En el modelo, <strong>Vusa</strong> representa los datos de
                  Estados Unidos y <strong>Vaus</strong> representa los datos de
                  Australia.
                </blockquote>
              </div>
            </section>

            <section
              id="series"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="02">
                Evolución de las series
              </ArticleTitle>

              <FigureCard
                image="/images/var-usa-australia/pib-usa-australia.png"
                title="Figura 1. PIB de Estados Unidos y Australia (1970-2000)"
                alt="Evolución del PIB de Estados Unidos y Australia entre 1970 y 2000"
                source="Fuente: elaboración propia con el programa RStudio."
                objectFit="contain"
                heightClass="min-h-[340px] sm:min-h-[560px]"
              />

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Las dos series muestran una trayectoria general ascendente.
                  Sus movimientos son visualmente cercanos durante buena parte
                  del período, aunque también presentan diferencias temporales
                  en la intensidad de sus variaciones.
                </p>

                <p>
                  Esta evolución conjunta motiva la estimación de un VAR, ya que
                  el método permite explicar cada variable a partir de sus
                  propios rezagos y de los rezagos de la otra economía.
                </p>
              </div>
            </section>

            <section
              id="model"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="03">
                Especificación del modelo VAR
              </ArticleTitle>

              <div className="space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  El modelo fue estimado en niveles originales e incorpora dos
                  rezagos para cada una de las variables. Por tanto, cada
                  ecuación incluye el primer y segundo rezago del PIB de Estados
                  Unidos y del PIB de Australia, además de una constante.
                </p>
              </div>

              <div className="my-8 space-y-4">
                <FormulaCard>
                  Vusa<sub>t</sub> = c₁ + β₁Vusa<sub>t−1</sub> +
                  β₂Vaus<sub>t−1</sub> + β₃Vusa<sub>t−2</sub> +
                  β₄Vaus<sub>t−2</sub> + ε₁<sub>t</sub>
                </FormulaCard>

                <FormulaCard>
                  Vaus<sub>t</sub> = c₂ + α₁Vusa<sub>t−1</sub> +
                  α₂Vaus<sub>t−1</sub> + α₃Vusa<sub>t−2</sub> +
                  α₄Vaus<sub>t−2</sub> + ε₂<sub>t</sub>
                </FormulaCard>
              </div>

              <DataTable
                title="Resumen general de las ecuaciones"
                headers={[
                  "Ecuación",
                  "Error residual",
                  "R²",
                  "R² ajustado",
                  "Estadístico F",
                  "p-value global",
                ]}
                rows={modelSummaryRows}
                caption="Resultados reportados por la salida del modelo VAR en RStudio."
              />
            </section>

            <section
              id="vusa-equation"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="04">
                Ecuación para Vusa
              </ArticleTitle>

              <FigureCard
                image="/images/var-usa-australia/ecuacion-vusa.png"
                title="Resultado de la ecuación para el PIB de Estados Unidos"
                alt="Salida de RStudio de la ecuación Vusa del modelo VAR"
                source="Fuente: elaboración propia con el programa RStudio."
                objectFit="contain"
                heightClass="min-h-[280px] sm:min-h-[430px]"
              />

              <div className="mt-8">
                <DataTable
                  headers={[
                    "Variable",
                    "Coeficiente",
                    "Error estándar",
                    "Estadístico t",
                    "p-value",
                    "Resultado",
                  ]}
                  rows={vusaRows}
                  caption="Coeficientes correspondientes a la ecuación Vusa."
                />
              </div>

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <BulletList
                  items={[
                    "Vusa.l1 presenta un coeficiente positivo y significativo. El PIB actual de Estados Unidos mantiene una relación positiva con su valor del período anterior.",
                    "Vaus.l1 no es significativo, por lo que el valor anterior del PIB de Australia no explica de forma estadísticamente clara el PIB actual de Estados Unidos.",
                    "Vusa.l2 presenta un coeficiente negativo y significativo. Esto indica una relación inversa entre el PIB actual de Estados Unidos y su valor de dos períodos atrás.",
                    "Vaus.l2 y la constante no son estadísticamente significativos.",
                  ]}
                />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MetricCard label="Coeficiente Vusa.l1" value="1.21558" />
                <MetricCard label="Coeficiente Vusa.l2" value="−0.22861" />
                <MetricCard label="R² ajustado" value="0.9992" />
              </div>
            </section>

            <section
              id="vaus-equation"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="05">
                Ecuación para Vaus
              </ArticleTitle>

              <FigureCard
                image="/images/var-usa-australia/ecuacion-vaus.png"
                title="Resultado de la ecuación para el PIB de Australia"
                alt="Salida de RStudio de la ecuación Vaus del modelo VAR"
                source="Fuente: elaboración propia con el programa RStudio."
                objectFit="contain"
                heightClass="min-h-[280px] sm:min-h-[430px]"
              />

              <div className="mt-8">
                <DataTable
                  headers={[
                    "Variable",
                    "Coeficiente",
                    "Error estándar",
                    "Estadístico t",
                    "p-value",
                    "Resultado",
                  ]}
                  rows={vausRows}
                  caption="Coeficientes correspondientes a la ecuación Vaus."
                />
              </div>

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <BulletList
                  items={[
                    "Vusa.l1 presenta un efecto positivo y significativo sobre Vaus. El PIB actual de Australia se relaciona positivamente con el PIB de Estados Unidos del período anterior.",
                    "Vaus.l1 también es positivo y significativo, mostrando persistencia en el crecimiento del PIB australiano.",
                    "Vusa.l2 no es significativo dentro de la ecuación para Australia.",
                    "Vaus.l2 y la constante tampoco muestran significancia estadística.",
                  ]}
                />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <MetricCard label="Coeficiente Vusa.l1" value="0.33898" />
                <MetricCard label="Coeficiente Vaus.l1" value="0.87005" />
                <MetricCard label="R² ajustado" value="0.9988" />
              </div>
            </section>

            <section
              id="impulse-response"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="06">
                Funciones impulso-respuesta
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Las funciones impulso-respuesta muestran cómo evoluciona una
                variable después de un cambio equivalente a una desviación
                estándar en ella misma o en la otra variable del sistema. Las
                líneas negras representan las respuestas estimadas y las líneas
                rojas los intervalos de confianza.
              </p>

              <div className="grid gap-6 xl:grid-cols-2">
                <FigureCard
                  image="/images/var-usa-australia/impulso-desde-vusa.png"
                  title="Impulsos originados en Vusa"
                  alt="Funciones impulso-respuesta generadas por un impulso en Vusa"
                  source="Fuente: elaboración propia con el programa RStudio."
                  objectFit="contain"
                  heightClass="min-h-[560px] sm:min-h-[720px]"
                />

                <FigureCard
                  image="/images/var-usa-australia/impulso-desde-vaus.png"
                  title="Impulsos originados en Vaus"
                  alt="Funciones impulso-respuesta generadas por un impulso en Vaus"
                  source="Fuente: elaboración propia con el programa RStudio."
                  objectFit="contain"
                  heightClass="min-h-[560px] sm:min-h-[720px]"
                />
              </div>

              <div className="mt-10">
                <DataTable
                  headers={["Impulso y respuesta", "Comportamiento", "Interpretación"]}
                  rows={impulseRows}
                  caption="Síntesis de las funciones impulso-respuesta presentadas en el análisis."
                />
              </div>

              <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-300">
                <p>
                  Cuando Vusa recibe un impulso, su respuesta aumenta y después
                  se estabiliza. El efecto de ese mismo impulso sobre Vaus
                  también es positivo y gana intensidad durante el horizonte
                  analizado.
                </p>

                <p>
                  No obstante, los intervalos de confianza se amplían conforme
                  transcurre el tiempo, lo cual reduce la certeza de las
                  estimaciones a horizontes más largos.
                </p>

                <p>
                  Ante un impulso originado en Vaus, la respuesta de Vaus es
                  positiva pero decreciente. La respuesta de Vusa es reducida y
                  su intervalo incorpora el cero, por lo que no se identifica un
                  efecto concluyente.
                </p>
              </div>
            </section>

            <section
              id="conclusions"
              className="scroll-mt-28 border-b border-white/10 py-12"
            >
              <ArticleTitle number="07">
                Conclusiones
              </ArticleTitle>

              <BulletList
                items={[
                  "En la ecuación para el PIB de USA, se observa una relación positiva significativa entre el valor actual del PIB de USA y su valor un período anterior, lo que indica cierta persistencia en el crecimiento económico de Estados Unidos. Sin embargo, el valor del PIB de USA no parece influenciarse significativamente por el valor anterior del PIB de Australia.",
                  "En la ecuación para el PIB de Australia, se encuentra una relación positiva significativa tanto con el valor actual del PIB de USA como con su valor un período anterior. Esto sugiere que el crecimiento económico en Australia se ve influenciado tanto por su propio crecimiento pasado como por el crecimiento pasado de Estados Unidos (economía central y globalizada).",
                  "Para el PIB de USA, el aumento en su valor tiene un efecto positivo sobre sí mismo, pero no parece tener un efecto significativo sobre el PIB de Australia a largo plazo (impulso respuesta).",
                  "•	Para el PIB de Australia, se observa un efecto positivo tanto sobre sí mismo como sobre el PIB de USA, lo que indica una relación de retroalimentación entre el crecimiento económico de ambos países(impulso respuesta)."
                ]}
              />
            </section>

            <section id="source-code" className="scroll-mt-28 pt-12">
              <ArticleTitle number="08">
                Código fuente
              </ArticleTitle>

              <p className="mb-8 text-[17px] leading-8 text-slate-300">
                Este apartado queda preparado para incorporar posteriormente el
                script completo utilizado en la estimación del modelo VAR.
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
                      modelo_var.R
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
                    "Series de tiempo",
                    "VAR",
                    "Rezagos",
                    "Impulso-respuesta",
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
          className={`block h-auto max-h-[900px] w-full rounded-xl bg-white ${
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

function FormulaCard({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-indigo-400/20 bg-indigo-400/[0.06] px-6 py-6 text-center">
      <p className="min-w-[760px] font-serif text-lg text-indigo-100 sm:text-xl">
        {children}
      </p>
    </div>
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