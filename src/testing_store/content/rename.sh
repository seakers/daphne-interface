for f in *.PNG; do
	mv -- "$f" "$(basename -- "$f" .PNG).png"
done
