import { useEffect, useRef, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import type { CreativeItem } from "../data/creative";

interface Props {
  item: CreativeItem | null;
  onClose: () => void;
}

function Artwork({ item }: { item: CreativeItem }) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);

  return (
    <figure className="artwork-figure">
      <div className="artwork-stage">
        <img
          key={attempt}
          className={status === "ready" ? "is-ready" : undefined}
          src={item.imagePath}
          alt={item.imageAlt}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
        />
        {status === "loading" && (
          <div className="artwork-status" role="status">
            <LoaderCircle
              className="artwork-spinner"
              size={24}
              aria-hidden="true"
            />
            <span>Loading artwork…</span>
          </div>
        )}
        {status === "error" && (
          <div className="artwork-status">
            <span role="alert">The artwork couldn’t load.</span>
            <button
              type="button"
              onClick={() => {
                setStatus("loading");
                setAttempt((value) => value + 1);
              }}
            >
              Try again
            </button>
          </div>
        )}
      </div>
      <figcaption>{item.medium}</figcaption>
    </figure>
  );
}

export default function CreativeModal({ item, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!item) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      dialog?.close();
      previouslyFocused?.focus();
    };
  }, [item]);

  if (!item) return null;
  const isArtwork = item.type === "sketch";
  const paragraphs = item.body?.trim().split(/\n\n+/) ?? [];
  return (
    <dialog
      ref={dialogRef}
      className={`creative-dialog${isArtwork ? " artwork-dialog" : ""}`}
      aria-labelledby="creative-dialog-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="dialog-panel">
        <div className="dialog-header">
          <div>
            <span>
              {item.type} / {item.date}
            </span>
            <h2 id="creative-dialog-title">{item.title}</h2>
          </div>
          <button type="button" aria-label="Close piece" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="dialog-body" tabIndex={isArtwork ? undefined : 0}>
          {isArtwork ? (
            <Artwork key={item.id} item={item} />
          ) : item.type === "poem" ? (
            <pre>{item.body}</pre>
          ) : (
            <div>
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          )}
        </div>
        <div className="dialog-footer">
          Aniruddh Ballal <span>WORDS & IMAGES</span>
        </div>
      </div>
    </dialog>
  );
}
