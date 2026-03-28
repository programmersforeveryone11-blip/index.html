// Control del Menú Lateral
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');

menuToggle.addEventListener('click', () => sideMenu.classList.add('active'));
closeMenu.addEventListener('click', () => sideMenu.classList.remove('active'));

// Efecto Destellos (Sparkles)
const container = document.getElementById('sparkle-container');

function addSparkle() {
    const s = document.createElement('div');
    s.className = 'sparkle';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.animationDelay = Math.random() * 2 + 's';

    container.appendChild(s);

    setTimeout(() => {
        s.remove();
        addSparkle();
    }, 2500);
}

// Crear 40 destellos iniciales
for (let i = 0; i < 40; i++) {
    addSparkle();
}

let cursoActivo = "";
let paso = 1;
let aciertos = 0;

function iniciarOContinuar(nombre) {
    cursoActivo = nombre;
    const guardado = localStorage.getItem(`progreso_${nombre}`);

    document.getElementById('modal-principal').style.display = 'flex';

    if (guardado) {
        // Si hay progreso, vamos al aula directo
        paso = parseInt(guardado);
        aciertos = parseInt(localStorage.getItem(`aciertos_${nombre}`) || 0);
        irAAula();
    } else {
        // Si no, mostramos registro
        document.getElementById('titulo-form').innerText = "Inscribirse en " + nombre;
        document.getElementById('pantalla-registro').style.display = 'block';
        document.getElementById('pantalla-aula').style.display = 'none';
        paso = 1;
        aciertos = 0;
    }
}

function finalizarRegistro() {
    const email = document.getElementById('user-email').value;
    if (!email) return alert("Por favor ingresa tu correo");

    // Guardar paso inicial
    localStorage.setItem(`progreso_${cursoActivo}`, 1);
    irAAula();
}

function irAAula() {
    document.getElementById('pantalla-registro').style.display = 'none';
    document.getElementById('pantalla-aula').style.display = 'block';
    dibujarContenido();
}

function cerrarYGuardar() {
    // Guardar en qué paso se quedó antes de cerrar con la X
    if (paso < 16) { // Solo si no ha terminado
        localStorage.setItem(`progreso_${cursoActivo}`, paso);
        localStorage.setItem(`aciertos_${cursoActivo}`, aciertos);
    }
    document.getElementById('modal-principal').style.display = 'none';
}

function dibujarContenido() {
    const contenedor = document.getElementById('dinamico-aula');

    if (paso <= 7) {
        contenedor.innerHTML = `
            <h3>Módulo ${paso} de 7</h3>
            <h2>${cursoActivo}: Tema ${paso}</h2>
            <p>Este es el párrafo informativo del tema actual. Lee con calma para el examen final.</p>
            <button class="btn-verde" onclick="avanzar()">Siguiente Lección</button>
        `;
    } else if (paso === 8) {
        contenedor.innerHTML = `
            <h2>¿Qué te ha parecido?</h2>
            <textarea id="opinion" placeholder="Escribe tu opinión..." style="width:100%; height:80px; border-radius:10px; padding:10px;"></textarea>
            <button class="btn-verde" style="margin-top:10px" onclick="avanzar()">Comenzar Examen de 7 Preguntas</button>
        `;
    } else if (paso <= 15) {
        const qNum = paso - 8;
        contenedor.innerHTML = `
            <h2>Examen Final: Pregunta ${qNum}/7</h2>
            <p>De acuerdo a lo aprendido, ¿cuál es la mejor opción?</p>
            <button class="opcion-examen" onclick="responder(true)">Opción A: Aplicar principios profesionales</button>
            <button class="opcion-examen" onclick="responder(false)">Opción B: Ignorar las lecciones</button>
            <button class="opcion-examen" onclick="responder(false)">Opción C: No seguir la técnica</button>
        `;
    } else {
        mostrarCertificado();
    }
}

function avanzar() {
    paso++;
    localStorage.setItem(`progreso_${cursoActivo}`, paso);
    dibujarContenido();
}

function responder(esCorrecto) {
    if (esCorrecto) aciertos++;
    localStorage.setItem(`aciertos_${cursoActivo}`, aciertos);
    avanzar();
}

function mostrarCertificado() {
    const contenedor = document.getElementById('dinamico-aula');
    if (aciertos === 7) {
        localStorage.removeItem(`progreso_${cursoActivo}`); // Reset para que pueda repetirlo si quiere
        contenedor.innerHTML = `
            <h1 style="color:#2d5a3c">¡COMPLETADO!</h1>
            <div style="background:white; border:8px double #c43670; padding:20px; border-radius:20px;">
                <h2 style="font-family:serif">DIPLOMA ACADÉMICO</h2>
                <p>Por haber aprobado todas las evaluaciones de ${cursoActivo}.</p>
                <img src="https://via.placeholder.com/150x100?text=Mariangles+Sello" alt="Diploma">
            </div>
            <button class="btn-verde" onclick="location.reload()">Salir y Guardar Certificado</button>
        `;
    } else {
        contenedor.innerHTML = `
            <h2>Aciertos: ${aciertos}/7</h2>
            <p>Debes responder todas bien. ¿Deseas reiniciar el examen?</p>
            <button class="btn-verde" onclick="reiniciarExamen()">Reiniciar Examen</button>
        `;
    }
}

function reiniciarExamen() {
    paso = 9; // Volver a la primera pregunta
    aciertos = 0;
    dibujarContenido();
}

const preguntas = [
    {
        q: "¿Qué prefieres hacer en tu tiempo libre?",
        a: [
            { t: "Mirar revistas y combinar outfits", c: "moda" },
            { t: "Analizar por qué una marca es famosa", c: "marketing" },
            { t: "Dibujar o crear diseños en la tablet", c: "diseño" }
        ]
    },
    {
        q: "¿Cuál de estos colores te atrae más?",
        a: [
            { t: "Texturas y telas suaves (Pasteles)", c: "moda" },
            { t: "Colores que llaman la atención (Neones)", c: "marketing" },
            { t: "Combinaciones armónicas (Minimalismo)", c: "diseño" }
        ]
    },
    {
        q: "¿Cómo te definirías mejor?",
        a: [
            { t: "Creativa y detallista", c: "moda" },
            { t: "Estratégica y comunicativa", c: "marketing" },
            { t: "Visual y perfeccionista", c: "diseño" }
        ]
    },
    {
        q: "¿Qué te gustaría lograr?",
        a: [
            { t: "Crear mi propia línea de ropa", c: "moda" },
            { t: "Hacer crecer mi propio negocio", c: "marketing" },
            { t: "Diseñar logos para grandes marcas", c: "diseño" }
        ]
    }
];

let indicePregunta = 0;
let puntaje = { moda: 0, marketing: 0, diseño: 0 };

function abrirTest() {
    indicePregunta = 0;
    puntaje = { moda: 0, marketing: 0, diseño: 0 };
    document.getElementById('modal-test').style.display = 'flex';
    mostrarPregunta();
}

function mostrarPregunta() {
    const contenedor = document.getElementById('contenido-test');
    if (indicePregunta < preguntas.length) {
        const p = preguntas[indicePregunta];
        let opcionesHTML = p.a.map(opt =>
            `<button class="opcion-test" onclick="sumarPunto('${opt.c}')">${opt.t}</button>`
        ).join('');

        contenedor.innerHTML = `
            <p style="color:#e67e22; font-weight:bold;">Pregunta ${indicePregunta + 1} de 4</p>
            <h2 style="margin-bottom:20px;">${p.q}</h2>
            ${opcionesHTML}
        `;
    } else {
        mostrarResultadoTest();
    }
}

function sumarPunto(categoria) {
    puntaje[categoria]++;
    indicePregunta++;
    mostrarPregunta();
}

function mostrarResultadoTest() {
    const contenedor = document.getElementById('contenido-test');
    // Lógica para ver cuál tuvo más puntos
    let ganador = Object.keys(puntaje).reduce((a, b) => puntaje[a] > puntaje[b] ? a : b);

    let nombreCurso = "";
    if (ganador === "moda") nombreCurso = "Taller de Moda";
    if (ganador === "marketing") nombreCurso = "Marketing Digital";
    if (ganador === "diseño") nombreCurso = "Logotipos y Diseño";

    contenedor.innerHTML = `
        <h2 style="color:#e67e22;">¡Resultado!</h2>
        <p>Basado en tus respuestas, tu curso ideal es:</p>
        <h1 style="font-family:'Playfair Display', serif; font-style:italic;">${nombreCurso}</h1>
        <button class="btn-test-naranja" style="margin-top:20px;" onclick="cerrarTest(); iniciarOContinuar('${nombreCurso}')">
            Empezar ahora
        </button>
    `;
}

function cerrarTest() {
    document.getElementById('modal-test').style.display = 'none';
}

let slideIndex = 1;
mostrarSlides(slideIndex);

// Cambiar por flechas
function cambiarSlide(n) {
    mostrarSlides(slideIndex += n);
}

// Cambiar por puntos
function irASlide(n) {
    mostrarSlides(slideIndex = n);
}

function mostrarSlides(n) {
    let i;
    let slides = document.getElementsByClassName("slide");
    let puntos = document.getElementsByClassName("punto");

    // Si llega al final, vuelve al principio
    if (n > slides.length) { slideIndex = 1 }
    // Si va hacia atrás desde el principio, va al final
    if (n < 1) { slideIndex = slides.length }

    // Ocultar todas
    for (i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
    }

    // Quitar estado activo de puntos
    for (i = 0; i < puntos.length; i++) {
        puntos[i].classList.remove("active");
    }

    // Mostrar actual
    slides[slideIndex - 1].classList.add("active");
    puntos[slideIndex - 1].classList.add("active");
}

// Auto-play cada 6 segundos
setInterval(() => {
    cambiarSlide(1);
}, 6000);
