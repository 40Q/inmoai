"use client";

import { useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const SOFIA_SYSTEM = `Sos Sofía, asistente virtual de InmoAI, una plataforma de IA para inmobiliarias argentinas. Atendés consultas de potenciales clientes que buscan propiedades en Buenos Aires.

Tu objetivo es:
1. Entender qué busca el cliente (alquiler o compra, zona, presupuesto, ambientes)
2. Hacer preguntas concretas y naturales para calificarlos
3. Sugerir propiedades ficticias pero realistas de la cartera
4. Proponer agendar una visita cuando el cliente muestra interés

Usá un tono amable, directo y argentino (vos, che, etc). Mensajes cortos, como WhatsApp real. Usá algún emoji ocasionalmente pero no exageres. Nunca rompas el personaje ni menciones que sos IA a menos que te lo pregunten directamente.

Propiedades disponibles (inventadas para la demo):
- 2 amb, Palermo, 55m², USD 89.000
- 3 amb con balcón, Palermo Hollywood, 85m², USD 118.000
- 1 amb, Villa Crespo, 38m², USD 62.000
- 3 amb, Belgrano, 90m², USD 135.000
- 2 amb, Recoleta, 65m², USD 105.000
- Alquiler: 2 amb, Caballito, $450.000/mes
- Alquiler: 1 amb, San Telmo, $320.000/mes

Si el cliente quiere agendar, ofrecé horarios de martes a sábado de 10 a 18hs y confirmá la cita.`;

function scrollToDemo() {
  document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
}

function scrollToComo() {
  document.getElementById("como")?.scrollIntoView({ behavior: "smooth" });
}

function DemoChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const msgsRef = useRef<HTMLDivElement>(null);

  async function sendDemo() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight, behavior: "smooth" });
    }, 0);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SOFIA_SYSTEM,
          messages: nextMessages,
        }),
      });

      const data = await res.json();
      const reply: string = data.content?.[0]?.text || "No te entendí bien, ¿me repetís?";
      setMessages([...nextMessages, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...nextMessages,
        { role: "assistant", content: "Hubo un problema de conexión, intentá de nuevo." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        msgsRef.current?.scrollTo({ top: msgsRef.current.scrollHeight, behavior: "smooth" });
      }, 0);
    }
  }

  return (
    <div className="demo-wrap">
      <div className="demo-top">
        <div className="demo-av">👩‍💼</div>
        <div>
          <div className="demo-name">Sofía · InmoAI</div>
          <div className="demo-status">● En línea ahora</div>
        </div>
      </div>
      <div className="demo-msgs" ref={msgsRef}>
        <div className="dm-bot">
          ¡Hola! Soy Sofía, asistente de InmoAI 👋 Contame, ¿estás buscando propiedad para alquilar o comprar?
        </div>
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="dm-user">{m.content}</div>
          ) : (
            <div key={i} className="dm-bot">{m.content}</div>
          )
        )}
        {loading && (
          <div className="dm-typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>
      <div className="demo-input-row">
        <input
          className="demo-input"
          type="text"
          placeholder="Escribile a Sofía..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendDemo()}
        />
        <button className="demo-send" onClick={sendDemo} disabled={loading}>
          ➤
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav>
        <div className="logo">
          inmo<span>AI</span>
        </div>
        <div className="nav-links">
          <a href="#como">Cómo funciona</a>
          <a href="#incluido">Qué incluye</a>
          <a href="#demo">Demo en vivo</a>
        </div>
        <button className="nav-btn" onClick={scrollToDemo}>
          Probá a Sofía →
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-pill">
            <span className="pill-dot"></span>Agente de IA para inmobiliarias
          </div>
          <h1>
            Agendá visitas
            <br />
            24/7 y cerrá
            <br />
            <em>más contratos.</em>
          </h1>
          <p className="hero-sub">
            Sofía atiende cada consulta de WhatsApp al instante, califica a tus clientes, recomienda
            propiedades y agenda visitas — las 24 horas, sin que nadie en tu equipo mueva un dedo.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={scrollToDemo}>
              Hablar con Sofía ahora
            </button>
            <button className="btn-outline" onClick={scrollToComo}>
              ¿Cómo funciona?
            </button>
          </div>
          <div className="trust-row">
            <div className="avatars">
              <div className="av">🏢</div>
              <div className="av">🏠</div>
              <div className="av">🏡</div>
            </div>
            Inmobiliarias de Argentina ya usan Sofía
          </div>
        </div>
        <div className="hero-right">
          <div className="wapp-wrap">
            <div className="wapp-top">
              <div className="wa-av">👩‍💼</div>
              <div>
                <div className="wa-name">Sofía · InmoAI</div>
                <div className="wa-status">● En línea</div>
              </div>
            </div>
            <div className="wapp-body">
              <div>
                <div className="wb">
                  ¡Hola! Soy Sofía, asistente de la inmobiliaria. Vi que te interesó una propiedad
                  🏠 ¿Estás buscando para alquilar o comprar?
                </div>
                <div className="wt">22:14</div>
              </div>
              <div>
                <div className="wu">Comprar, presupuesto hasta 120k USD</div>
                <div className="wt r">22:15</div>
              </div>
              <div>
                <div className="wb">
                  ¡Perfecto! ¿Cuántos ambientes necesitás y en qué zona preferís? Tengo varias
                  opciones en ese rango 👇
                </div>
                <div className="wt">22:15</div>
              </div>
              <div>
                <div className="wu">3 ambientes, Palermo o Villa Crespo</div>
                <div className="wt r">22:16</div>
              </div>
              <div>
                <div className="wb">Encontré la opción ideal para vos ✨</div>
                <div className="wt">22:16</div>
              </div>
              <div className="wa-prop">
                <div className="prop-thumb">🏢</div>
                <div className="prop-body">
                  <div className="prop-ttl">3 amb. con balcón · Palermo Hollywood</div>
                  <div className="prop-det">85m² · Piso 6 · Luminoso · Cochera</div>
                  <div className="prop-prc">USD 118.000</div>
                </div>
                <button className="prop-agd">📅 Agendar visita</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      <div className="tagline-band">
        <h2>
          Sofía agenda visitas 24/7.
          <br />
          Más visitas, <em>más contratos.</em>
        </h2>
        <p>
          Sofía califica a cada lead, les muestra las propiedades que más les convienen y agenda las
          visitas con el broker asignado — automáticamente, a cualquier hora del día o de la noche.
        </p>
      </div>

      {/* PROBLEMS */}
      <section className="problems">
        <div className="sec-tag">El problema</div>
        <h2 className="sec-h">
          El lead se lo lleva
          <br />
          el que primero
          <br />
          <em>contesta.</em>
        </h2>
        <p className="sec-sub" style={{ color: "#6B6A65" }}>
          Cada hora sin respuesta es un lead que se va con la competencia. Estos son los números de
          la industria.
        </p>
        <div className="prob-stats">
          <div className="prob-stat">
            <div className="ps-num">78%</div>
            <div className="ps-title">de leads sin respuesta</div>
            <div className="ps-desc">
              De cada 10 consultas que entran por WhatsApp fuera del horario laboral, casi 8 quedan
              sin respuesta hasta el día siguiente.
            </div>
          </div>
          <div className="prob-stat">
            <div className="ps-num">12hs</div>
            <div className="ps-title">promedio de respuesta</div>
            <div className="ps-desc">
              El tiempo promedio que tarda una inmobiliaria en responder un lead. Para ese momento,
              el cliente ya habló con tres competidores.
            </div>
          </div>
          <div className="prob-stat">
            <div className="ps-num">46%</div>
            <div className="ps-title">del tiempo perdido en admin</div>
            <div className="ps-desc">
              Casi la mitad del tiempo de un broker se va en calificar leads, coordinar visitas y
              hacer seguimientos manuales.
            </div>
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="how" id="como">
        <div className="sec-tag">Cómo funciona</div>
        <h2 className="sec-h">
          De &ldquo;Hola&rdquo; a visita
          <br />
          <em>agendada</em> sin que
          <br />
          muevas un dedo.
        </h2>
        <p className="sec-sub">
          Sofía se encarga de todo el proceso de calificación y agenda, mientras tu equipo se
          concentra en cerrar.
        </p>
        <div className="how-grid">
          <div className="steps">
            <div className="step">
              <div className="step-n">01</div>
              <div>
                <div className="step-title">Responde al instante, siempre</div>
                <div className="step-desc">
                  Llega por WhatsApp directo, desde un anuncio de Facebook o mandando el link de
                  Zona Propia — Sofía responde en segundos, a las 3am si hace falta.
                </div>
                <div className="step-tag">Respuesta en menos de 10 segundos</div>
              </div>
            </div>
            <div className="step">
              <div className="step-n">02</div>
              <div>
                <div className="step-title">Califica en la conversación</div>
                <div className="step-desc">
                  En un chat natural, Sofía entiende zona, presupuesto, ambientes y tipo de
                  operación. Tu broker recibe el perfil completo antes de decir hola.
                </div>
                <div className="step-tag">Perfil completo antes de la primera llamada</div>
              </div>
            </div>
            <div className="step">
              <div className="step-n">03</div>
              <div>
                <div className="step-title">Recomienda y agenda visitas</div>
                <div className="step-desc">
                  Sofía muestra las propiedades más relevantes de tu cartera y agenda con el broker
                  asignado. Si la primera no convence, ya tiene la segunda lista para el mismo turno.
                </div>
                <div className="step-tag">Visitas optimizadas para cerrar</div>
              </div>
            </div>
            <div className="step">
              <div className="step-n">04</div>
              <div>
                <div className="step-title">Sigue hasta que cierra</div>
                <div className="step-desc">
                  Recordatorios automáticos, re-engagement si el cliente se desconecta y
                  notificaciones a tu equipo en cada paso. Ningún lead se pierde por olvido.
                </div>
                <div className="step-tag">Seguimiento hasta el contrato firmado</div>
              </div>
            </div>
          </div>
          <div className="how-mockup">
            <div className="hm-top">
              <div className="hm-av">👩‍💼</div>
              <div>
                <div className="hm-name">Sofía · InmoAI</div>
                <div className="hm-status">● En línea</div>
              </div>
            </div>
            <div className="hm-body">
              <div>
                <div className="wb">Hola 👋 Soy Sofía. ¿En qué te puedo ayudar hoy?</div>
                <div className="wt">10:02</div>
              </div>
              <div>
                <div className="wu">Me llegó un anuncio de un depto en Recoleta</div>
                <div className="wt r">10:03</div>
              </div>
              <div>
                <div className="wb">
                  ¡Claro! ¿Me mandás el link o el número del anuncio? Lo veo al toque 🔍
                </div>
                <div className="wt">10:03</div>
              </div>
              <div>
                <div className="wu">zonaprop.com.ar/inmueble/1234567</div>
                <div className="wt r">10:04</div>
              </div>
              <div>
                <div className="wb">
                  Perfecto, lo tengo. Depto de 2 ambientes, 55m², piso 4, muy luminoso. USD 89.000.
                  ¿Tiene todo lo que buscás o querés ver opciones similares en la zona?
                </div>
                <div className="wt">10:04</div>
              </div>
              <div>
                <div className="wu">Me gusta, ¿puedo visitarlo esta semana?</div>
                <div className="wt r">10:05</div>
              </div>
              <div>
                <div className="wb">
                  ¡Por supuesto! El corredor tiene disponibilidad el miércoles a las 11hs o el
                  jueves a las 17hs. ¿Cuál te viene mejor?
                </div>
                <div className="wt">10:05</div>
              </div>
              <div>
                <div className="wu">El miércoles perfecto</div>
                <div className="wt r">10:06</div>
              </div>
              <div>
                <div className="wb">
                  ✅ ¡Listo! Visita agendada para el miércoles a las 11hs. Te mando los datos de
                  acceso y un recordatorio el día anterior. ¡Nos vemos!
                </div>
                <div className="wt">10:06</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section className="included" id="incluido">
        <div className="sec-tag">Qué incluye</div>
        <h2 className="sec-h">
          Todo listo desde
          <br />
          el <em>primer día.</em>
        </h2>
        <p className="sec-sub">
          No necesitás contratar nada más. Sofía viene con todo lo que tu inmobiliaria necesita para
          empezar a cerrar más.
        </p>
        <div className="inc-grid">
          <div className="inc-item">
            <span className="inc-icon">💬</span>
            <div className="inc-title">Agente de WhatsApp 24/7</div>
            <div className="inc-desc">
              Sofía atiende todas las consultas entrantes al instante, a cualquier hora. Nunca deja
              un mensaje sin respuesta.
            </div>
          </div>
          <div className="inc-item">
            <span className="inc-icon">🎯</span>
            <div className="inc-title">Calificación automática</div>
            <div className="inc-desc">
              Detecta zona, presupuesto, ambientes y tipo de operación en una conversación natural.
              Tu equipo recibe leads listos.
            </div>
          </div>
          <div className="inc-item">
            <span className="inc-icon">🏠</span>
            <div className="inc-title">Motor de recomendación</div>
            <div className="inc-desc">
              Cruza el perfil del cliente con tu cartera y sugiere las propiedades más relevantes.
              Importamos tu Excel o CSV.
            </div>
          </div>
          <div className="inc-item">
            <span className="inc-icon">📅</span>
            <div className="inc-title">Agenda inteligente</div>
            <div className="inc-desc">
              Agenda visitas considerando la disponibilidad del broker asignado a cada propiedad. Sin
              intercambio de mensajes manual.
            </div>
          </div>
          <div className="inc-item">
            <span className="inc-icon">📊</span>
            <div className="inc-title">CRM integrado</div>
            <div className="inc-desc">
              Panel con todos tus leads, su perfil, estado del pipeline y propiedades de interés.
              Visibilidad total de tu cartera de prospectos.
            </div>
          </div>
          <div className="inc-item">
            <span className="inc-icon">🔔</span>
            <div className="inc-title">Seguimiento automático</div>
            <div className="inc-desc">
              Recordatorios antes de cada visita y re-engagement si el lead se desconecta. Ninguna
              venta se pierde por falta de seguimiento.
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="stats-bar">
        <div>
          <div className="sb-num">&lt;10s</div>
          <div className="sb-label">Tiempo de respuesta</div>
        </div>
        <div>
          <div className="sb-num">24/7</div>
          <div className="sb-label">Disponibilidad</div>
        </div>
        <div>
          <div className="sb-num">0</div>
          <div className="sb-label">Leads perdidos por no contestar</div>
        </div>
        <div>
          <div className="sb-num">+3×</div>
          <div className="sb-label">Capacidad por broker</div>
        </div>
      </div>

      {/* ROI */}
      <section className="roi">
        <div className="sec-tag">El número que importa</div>
        <h2 className="sec-h">
          Una persona filtrando
          <br />
          mensajes cuesta
          <br />
          <em>más de $1.000/mes.</em>
        </h2>
        <p className="sec-sub">
          La mayoría de las inmobiliarias tienen una humano que atiende el WhatsApp, filtra consultas
          y coordina las agendas de los brokers. Sofía hace exactamente eso — por una fracción del
          costo.
        </p>
        <div className="roi-grid">
          <div className="roi-card">
            <div className="roi-card-title">Humano vs. Sofía</div>
            <div className="roi-row">
              <span className="roi-row-label">👩‍💼 Humano</span>
              <span className="roi-row-val red">+$1.000/mes</span>
            </div>
            <div className="roi-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
              <span className="roi-row-label">🤖 Sofía</span>
              <span className="roi-row-val green">Fracción del costo</span>
            </div>
            <div
              className="roi-total"
              style={{ marginTop: 28, flexDirection: "column", alignItems: "flex-start", gap: 8 }}
            >
              <span className="roi-total-label">Y además Sofía…</span>
              <span style={{ fontSize: 13, color: "var(--green)", lineHeight: 1.7 }}>
                ✓ Trabaja 24/7, incluso feriados
                <br />
                ✓ Atiende 500 chats al mismo tiempo
                <br />
                ✓ Nunca se olvida de hacer seguimiento
                <br />
                ✓ No comete errores de coordinación
              </span>
            </div>
          </div>
          <div className="roi-points">
            <div className="roi-point">
              <div className="roi-point-icon">🌙</div>
              <div>
                <div className="roi-point-title">La humano duerme. Sofía no.</div>
                <div className="roi-point-desc">
                  El horario de mayor búsqueda de propiedades es después de las 21hs. Sofía está
                  exactamente ahí, mientras tu equipo descansa.
                </div>
              </div>
            </div>
            <div className="roi-point">
              <div className="roi-point-icon">📈</div>
              <div>
                <div className="roi-point-title">Tus brokers hacen lo que Sofía no puede</div>
                <div className="roi-point-desc">
                  Construir confianza, negociar y cerrar. Sofía los alimenta con leads calificados y
                  agenda llena para que se concentren en eso.
                </div>
              </div>
            </div>
            <div className="roi-point">
              <div className="roi-point-icon">💰</div>
              <div>
                <div className="roi-point-title">Un contrato más por mes lo paga todo</div>
                <div className="roi-point-desc">
                  Si Sofía captura un solo lead que se hubiera perdido fuera de horario y termina en
                  contrato firmado, la inversión está cubierta varias veces.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTIONS */}
      <section className="obj" style={{ background: "var(--bg)" }}>
        <div className="sec-tag text-center">Antes de hablar con Sofía</div>
        <h2 className="sec-h text-center" style={{ maxWidth: 540, margin: "0 auto 12px" }}>
          Las preguntas que
          <br />
          todos <em>se hacen.</em>
        </h2>
        <p className="sec-sub text-center" style={{ margin: "0 auto 0", maxWidth: 460 }}>
          Respuestas directas, sin vueltas.
        </p>
        <div className="obj-grid">
          <div className="obj-item">
            <div className="obj-q">¿Mis clientes van a saber que es una IA?</div>
            <div className="obj-a">
              Sofía se presenta como asistente de tu inmobiliaria. Podés elegir si aclarar que es IA
              o no. La experiencia es tan natural que la mayoría no lo distingue — y eso es
              exactamente el punto.
            </div>
          </div>
          <div className="obj-item">
            <div className="obj-q">¿Qué pasa si el cliente pregunta algo complicado?</div>
            <div className="obj-a">
              Sofía detecta cuándo una consulta necesita intervención humana y deriva al broker
              correspondiente, con todo el contexto de la conversación ya en la pantalla.
            </div>
          </div>
          <div className="obj-item">
            <div className="obj-q">¿Cómo se conecta con mis propiedades?</div>
            <div className="obj-a">
              Importamos tu Excel, CSV o la exportación de cualquier portal. En 48 horas Sofía ya
              conoce toda tu cartera. También podemos conectar con portales como Zonaprop si los
              usás.
            </div>
          </div>
          <div className="obj-item">
            <div className="obj-q">¿Cuánto tarda en estar funcionando?</div>
            <div className="obj-a">
              7 días desde que firmamos. Configuramos el agente, conectamos tu base de propiedades y
              capacitamos a tu equipo. Sin meses de implementación ni proyectos interminables.
            </div>
          </div>
          <div className="obj-item">
            <div className="obj-q">¿Qué pasa con el número de WhatsApp?</div>
            <div className="obj-a">
              Podés usar tu número actual de WhatsApp Business o te ayudamos a tramitar uno nuevo.
              El proceso tarda 2-3 días hábiles con Meta.
            </div>
          </div>
          <div className="obj-item">
            <div className="obj-q">¿Puedo cancelar cuando quiero?</div>
            <div className="obj-a">
              Sin contratos largos.
            </div>
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="demo-section" id="demo">
        <div className="sec-tag text-center">Demo en vivo</div>
        <h2 className="sec-h text-center" style={{ maxWidth: 540, margin: "0 auto 12px" }}>
          Probá a <em>Sofía</em>
          <br />
          ahora mismo.
        </h2>
        <p className="sec-sub text-center" style={{ margin: "0 auto", maxWidth: 480 }}>
          Esta es Sofía real. Escribile como si fueras un cliente buscando propiedad en Buenos Aires.
        </p>
        <DemoChat />
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="sec-tag" style={{ color: "#6B6A65" }}>
          Empezá hoy
        </div>
        <h2>
          Más visitas agendadas.
          <br />
          <em>Más contratos</em> firmados.
        </h2>
        <p>
          Implementación en 7 días. Sin contratos largos. Si en el primer mes no ves resultados, te
          devolvemos el dinero.
        </p>
        <button
          className="btn-primary"
          style={{ fontSize: 16, padding: "16px 44px" }}
          onClick={scrollToDemo}
        >
          Hablar con Sofía gratis →
        </button>
      </section>

      <footer>
        <div className="f-logo">
          inmo<span>AI</span>
        </div>
        <div>© 2025 InmoAI · Buenos Aires, Argentina</div>
      </footer>
    </>
  );
}
