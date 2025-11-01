"use client";
import React, { useRef, useEffect, useState } from "react";

// Physical constants
const h = 6.62607015e-34;
const c = 299792458;
const kB = 1.380649e-23;
const sigma = 5.670374419e-8;

const LAMBDA_MIN = 380e-9;
const LAMBDA_MAX = 780e-9;

function planckLambda(lambda: number, T: number) {
  const a = 2 * h * c ** 2;
  const b = (h * c) / (lambda * kB * T);
  return a / lambda ** 5 / (Math.exp(b) - 1);
}

function wavelengthToRGB(lambda: number) {
  let R = 0,
    G = 0,
    B = 0;
  if (lambda >= 380 && lambda < 440) {
    R = -(lambda - 440) / (440 - 380);
    G = 0;
    B = 1;
  } else if (lambda >= 440 && lambda < 490) {
    R = 0;
    G = (lambda - 440) / (490 - 440);
    B = 1;
  } else if (lambda >= 490 && lambda < 510) {
    R = 0;
    G = 1;
    B = -(lambda - 510) / (510 - 490);
  } else if (lambda >= 510 && lambda < 580) {
    R = (lambda - 510) / (580 - 510);
    G = 1;
    B = 0;
  } else if (lambda >= 580 && lambda < 645) {
    R = 1;
    G = -(lambda - 645) / (645 - 580);
    B = 0;
  } else if (lambda >= 645 && lambda <= 780) {
    R = 1;
    G = 0;
    B = 0;
  }

  let factor = 0;
  if (lambda >= 380 && lambda < 420)
    factor = 0.3 + (0.7 * (lambda - 380)) / (420 - 380);
  else if (lambda >= 420 && lambda <= 700) factor = 1;
  else if (lambda > 700 && lambda <= 780)
    factor = 0.3 + (0.7 * (780 - lambda)) / (780 - 700);

  const gamma = 0.8;
  const r = Math.pow(R * factor, gamma) * 255;
  const g = Math.pow(G * factor, gamma) * 255;
  const b = Math.pow(B * factor, gamma) * 255;
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

function colorTemperatureToRGB(kelvin: number) {
  const temp = kelvin / 100;
  let red, green, blue;

  if (temp <= 66) red = 255;
  else red = 329.698727446 * Math.pow(temp - 60, -0.1332047592);

  if (temp <= 66) green = 99.4708025861 * Math.log(temp) - 161.1195681661;
  else green = 288.1221695283 * Math.pow(temp - 60, -0.0755148492);

  if (temp >= 66) blue = 255;
  else if (temp <= 19) blue = 0;
  else blue = 138.5177312231 * Math.log(temp - 10) - 305.0447927307;

  return {
    r: Math.min(255, Math.max(0, Math.round(red))),
    g: Math.min(255, Math.max(0, Math.round(green))),
    b: Math.min(255, Math.max(0, Math.round(blue))),
  };
}

export default function BlackbodyApplet() {
  const [temperature, setTemperature] = useState(5778); // Kelvin
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const numPoints = 200;
  const wavelengths = Array.from(
    { length: numPoints },
    (_, i) => LAMBDA_MIN + (i / (numPoints - 1)) * (LAMBDA_MAX - LAMBDA_MIN)
  );
  const spectral = wavelengths.map((l) => planckLambda(l, temperature));
  const maxSpec = Math.max(...spectral);
  const spectralNormalized = spectral.map((s) => s / maxSpec);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < spectralNormalized.length; i++) {
      const t = i / (spectralNormalized.length - 1);
      const lambdaNm = 380 + t * 400;
      const col = wavelengthToRGB(lambdaNm);
      ctx.fillStyle = `rgba(${col.r},${col.g},${col.b},${spectralNormalized[i]})`;
      const x = t * w;
      ctx.fillRect(
        x,
        h - spectralNormalized[i] * h,
        w / spectralNormalized.length,
        h
      );
    }

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    for (let i = 0; i < spectralNormalized.length; i++) {
      const t = i / (spectralNormalized.length - 1);
      const x = t * w;
      const y = h - spectralNormalized[i] * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [temperature]);

  const stefan = sigma * Math.pow(temperature, 4);
  const color = colorTemperatureToRGB(temperature);
  const tempC = temperature - 273.15;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl mb-4 text-center">
        Blackbody Radiation Explorer
      </h1>
      <div
        data-augmented-ui="tl-clip br-clip both"
        className="
          thin-border
          relative
          pt-5
          my-4
          thin-border
      "
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: 250 }}
          className="
            w-full
            h-[250px]
            thin-border
          "
        />
      </div>

      <div className="mt-4 flex flex-col gap-4 items-center">
        {/* Manual Kelvin input */}
        <div
          data-augmented-ui="tl-clip br-clip both"
          className="
          flex
          justify-between
          w-full
          py-3 
          px-5
        text-cyan-200 
          thin-border
          "
        >
          <div>Temperature (K)</div>
          <input
            type="number"
            value={temperature.toFixed(2)}
            onChange={(e) => {
              const c = Number(e.target.value);
              if (!isNaN(c)) setTemperature(Number(e.target.value));
            }}
            className="w-auto px-2 py-1 text-center focus:ring:0 focus:border-0"
          />
        </div>

        {/* Manual Celsius input */}
        <div
          data-augmented-ui="tl-clip br-clip both"
          className="
          flex
          justify-between
          w-full
          py-3 
          px-5
        text-cyan-200 
          thin-border
          "
        >
          <div>Temperature (°C)</div>
          <input
            type="number"
            value={tempC.toFixed(2)}
            onChange={(e) => {
              const c = Number(e.target.value);
              if (!isNaN(c)) setTemperature(c + 273.15);
            }}
            className="w-auto px-2 py-1 text-center focus:ring:0 focus:border-0"
          />
        </div>
      </div>

      <div className="mt-4 p-3 rounded text-md text-center">
        <p>Bolometric Power: {stefan.toExponential(3)} W·m⁻²</p>
      </div>
    </div>
  );
}
