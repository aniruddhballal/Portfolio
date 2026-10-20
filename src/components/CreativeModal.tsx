import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { CreativeItem } from "../data/creative";

interface Props {
  item: CreativeItem | null;
  onClose: () => void;
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
  const paragraphs = item.body?.trim().split(/\n\n+/) ?? [];
  return (
    <dialog
      ref={dialogRef}
      className="creative-dialog"
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
        <div className="dialog-body" tabIndex={0}>
          {item.type === "sketch" ? (
            <figure>
              <img src={item.imagePath} alt={item.imageAlt} />
              <figcaption>{item.medium}</figcaption>
            </figure>
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
