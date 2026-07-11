"use client";

import { cancelShopOrderAction } from "./actions";

export function CancelOrderButton({ requestId }: { requestId: string }) {
  return (
    <form
      action={cancelShopOrderAction}
      onSubmit={(event) => {
        if (!confirm("Sigur vrei să anulezi această comandă?")) {
          event.preventDefault();
        }
      }}
      className="mt-3 flex justify-end border-t border-border-sand pt-3"
    >
      <input type="hidden" name="requestId" value={requestId} />
      <button
        type="submit"
        className="text-sm font-semibold text-signal-red transition-opacity duration-200 hover:opacity-70"
      >
        Anulează comanda
      </button>
    </form>
  );
}
