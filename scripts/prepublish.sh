
echo "Transpiling ES2015..."
echo ""
rm -rf ./dist && ./node_modules/.bin/babel src --out-dir ./dist
echo ""
echo "Done transpiling ES2015"
