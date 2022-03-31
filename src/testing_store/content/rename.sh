for f in *.PNG; do
	mv -- "$f" "$(basename -- "$f" .PNG)LCCD.png"
done
