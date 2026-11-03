import Image from "next/image";
import DrawingCanvas from "@/components/DravingCanvas";

export default function Home() {
  return (
    <>
      <div>
        <DrawingCanvas></DrawingCanvas>
      </div>
    </>
  );
}
