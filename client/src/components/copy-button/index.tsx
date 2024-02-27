import { useState } from "react";

import { Button, DSFRColors } from "@dataesr/dsfr-plus";
import { CopyToClipboard } from 'react-copy-to-clipboard';



export default function CopyButton({ color = "beige-gris-galet", text }: { color?: DSFRColors, text: string }) {
  const [copied, setCopied] = useState(false);

  function onClickHandler() {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  }

  return (
    <CopyToClipboard text={text} onCopy={() => onClickHandler()}>
      <Button
        color={color}
        icon={copied ? "success-fill" : "clipboard-fill"}
        size="sm"
      >
        {copied ? "copié" : "copier le code"}

      </Button>
    </CopyToClipboard>
  );
}