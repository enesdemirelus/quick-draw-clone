import DrawingCanvas from "@/components/DravingCanvas";

const CLASSES = [
  "cat",
  "dog",
  "house",
  "car",
  "tree",
  "apple",
  "fish",
  "bicycle",
  "star",
  "airplane",
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-12 sm:py-16">
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Quick, Draw!
        </h1>
        <p className="mt-2 text-stone-500">
          Draw one of the things below and let the model guess what it is.
        </p>
      </header>

      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {CLASSES.map((name) => (
          <li
            key={name}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-600"
          >
            {name}
          </li>
        ))}
      </ul>

      <div className="mt-10 w-full">
        <DrawingCanvas />
      </div>
    </main>
  );
}
