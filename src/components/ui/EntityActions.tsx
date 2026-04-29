"use client";

import { FavoriteButton } from "./FavoriteButton";
import { NoteForm } from "./NoteForm";

interface Props {
  entityType: string;
  entityId: string;
  entityName: string;
}

export function EntityActions({ entityType, entityId, entityName }: Props) {
  return (
    <div className="flex gap-2">
      <FavoriteButton entityType={entityType} entityId={entityId} />
      <NoteForm entityType={entityType} entityId={entityId} entityName={entityName} />
    </div>
  );
}
