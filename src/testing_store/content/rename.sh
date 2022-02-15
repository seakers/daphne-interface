for f in *.PNG; do
	mv -- "$f" "$(basename -- "$f" .PNG)CA.png"
done
