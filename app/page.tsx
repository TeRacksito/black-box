export default function Home() {
  return "Testo es texto de ejemplo para llenar la página\n"
    .repeat(100)
    .split("\n")
    .map((s, index) => <div key={index}>{s}</div>);
}
