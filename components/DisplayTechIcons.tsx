"use client";

import { cn, getTechLogos } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface TechIconProps {
  techStack: string[];
}

interface TechIcon {
  tech: string;
  url: string;
}

const DisplayTechIcons = ({ techStack }: TechIconProps) => {
  const [techIcons, setTechIcons] = useState<TechIcon[]>([]);

  useEffect(() => {
    const loadTechIcons = async () => {
      const icons = await getTechLogos(techStack);
      setTechIcons(icons);
    };
    loadTechIcons();
  }, [techStack]);

  return (
    <div className="flex flex-row">
      {techIcons.slice(0, 3).map(({ tech, url }, index) => (
        <div
          key={tech}
          className={cn(
            "relative group bg-dark-300 rounded-full p-2 flex-center",
            index >= 1 && "-ml-3"
          )}
        >
          <span className="tech-tooltip">{tech}</span>
          <Image
            src={url}
            alt={tech}
            width={100}
            height={100}
            className="size-5"
          />
        </div>
      ))}
    </div>
  );
};

export default DisplayTechIcons;
