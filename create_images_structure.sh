#!/bin/bash
# ============================================================
# steve.bru — Création de la structure images/voyages/
# À exécuter depuis la racine du site :
#   cd ~/Documents/20_steve.bru/site
#   bash create_images_structure.sh
# ============================================================

# Liste des 36 ids de voyages
VOYAGES=(
  "hongrie-201010"
  "finlande-201106"
  "irlande-201207"
  "bolivie-201207"
  "espagne-201210"
  "pologne-201212"
  "norvege-201407"
  "portugal-201410"
  "norvege-201507"
  "turquie-201510"
  "usa-201602"
  "portugal-201706"
  "canada-201707"
  "norvege-201712"
  "usa-201807"
  "croatie-201809"
  "portugal-201904"
  "islande-201907"
  "autriche-201910"
  "norvege-202007"
  "pologne-202107"
  "irlande-202111"
  "portugal-202205"
  "finlande-202207"
  "danemark-202212"
  "canada-202307"
  "nzl-202310"
  "usa-202312"
  "portugal-202402"
  "japon-202403"
  "tanzanie-202407"
  "espagne-202410"
  "norvege-202501"
  "canada-202507"
  "vietnam-202604"
  "norvege-202606"
)

echo "Création de la structure images/voyages/..."
echo ""

for ID in "${VOYAGES[@]}"; do
  mkdir -p "images/voyages/${ID}/thumb"
  mkdir -p "images/voyages/${ID}/full"
  echo "  ✓ images/voyages/${ID}/"
done

echo ""
echo "Structure créée — 36 dossiers voyage × 2 (thumb + full)"
echo ""
echo "Convention de nommage des photos :"
echo "  thumb/  →  ${VOYAGES[0]}-001.jpg  (800px, JPEG 75%, max 200 Ko)"
echo "  full/   →  ${VOYAGES[0]}-001.jpg  (2048px, JPEG 85%, max 1 Mo)"
echo ""
echo "Exemple pour la Tanzanie :"
echo "  images/voyages/tanzanie-202407/thumb/tanzanie-202407-001.jpg"
echo "  images/voyages/tanzanie-202407/full/tanzanie-202407-001.jpg"
