#!/bin/bash

DIR=/tmp/dist-colorful-choice
echo "Output dir: $DIR"

FRONT=$DIR/front.html
BACK=$DIR/back.html
STYLE=$DIR/style.css

rm -rf $DIR
mkdir $DIR

cp front.html $FRONT
cp back.html $BACK

# 移除 /* 注释 */
sed style.css -e '\|^\s*/\*.*\*/$|d' >> $STYLE

cat << EOF >> $STYLE

</style>
<script>

EOF

# 移除 // 注释
sed anki-persistence.js -e 's#//.*$##' >> $STYLE
echo "" >> $STYLE

# 移除 // 注释 和导出语句
sed script.js -e 's#//.*$##' -e '/^module.exports/d' >> $STYLE
echo "" >> $STYLE

echo "</script>" >> $STYLE