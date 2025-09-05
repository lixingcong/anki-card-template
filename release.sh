#!/bin/bash

if [[ "$#" -ne 1 ]]; then
    echo "Usage: $0 <folder-name>"
    exit 1
fi

INPUT_DIR=$1
if [[ ! -d $INPUT_DIR ]]; then
    echo "Invalid folder: $INPUT_DIR"
    exit 1
fi

OUTPUT_DIR=/tmp/$INPUT_DIR
COMMON_DIR=common

IN_FRONT=$INPUT_DIR/front.html
IN_BACK=$INPUT_DIR/back.html
IN_STYLE=$INPUT_DIR/style.css
IN_SCRIPT=$INPUT_DIR/script.js
IN_PERSISTENCE=$COMMON_DIR/anki-persistence.js
IN_COMMON_UTILS=$COMMON_DIR/utils.js
IN_COMMON_STYLE=$COMMON_DIR/style.css

OUT_FRONT=$OUTPUT_DIR/front.html
OUT_BACK=$OUTPUT_DIR/back.html
OUT_STYLE=$OUTPUT_DIR/style.css

if ! [[ -f $IN_FRONT && -f $IN_BACK ]]; then
    echo "Failed: can not find $IN_FRONT or $IN_BACK"
    exit 1
fi

# clean up
rm -rf $OUTPUT_DIR
mkdir -p $OUTPUT_DIR

cp $IN_FRONT $OUT_FRONT
cp $IN_BACK $OUT_BACK

# 移除 /* 注释 */
if [ -f $IN_STYLE ]; then
    sed $IN_STYLE -e '\|^\s*/\*.*\*/$|d' >> $OUT_STYLE
    echo "" >> $OUT_STYLE
fi

sed $IN_COMMON_STYLE -e '\|^\s*/\*.*\*/$|d' >> $OUT_STYLE
echo "" >> $OUT_STYLE

cat << EOF >> $OUT_STYLE

</style>
<script>

EOF

# 移除 // 注释
sed $IN_PERSISTENCE -e 's#//.*$##' >> $OUT_STYLE
echo "" >> $OUT_STYLE

# 移除 // 注释 和导出语句
if [ -f $IN_SCRIPT ]; then
    sed $IN_SCRIPT -e 's#//.*$##' -e '/^module.exports/d' >> $OUT_STYLE
    echo "" >> $OUT_STYLE
fi

# 移除 // 注释 和导出语句
sed $IN_COMMON_UTILS -e 's#//.*$##' -e '/^module.exports/d' >> $OUT_STYLE
echo "" >> $OUT_STYLE

echo "</script>" >> $OUT_STYLE

# 显示结果
find $OUTPUT_DIR