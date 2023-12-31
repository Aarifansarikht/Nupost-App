import * as React from 'react';
import { Image, Pressable, View } from 'react-native';
import useLayout from '../../../hooks/useLayout';
import { fontNameSpaces } from '../../../primitives';
import { getButtonColors, getSpacingConfig, getTextStyle } from '../../../primitives/buttons';
import { Pointer } from '../../Helpers';
import Typography from '../../Typography';
import useStyles from '../styles';
import { ButtonProps } from '../types';

const FlatButton: React.FC<ButtonProps> = ({
    children,
    color,
    colorConfig,
    colorMode = 'dark',
    disabled,
    elevationDirection,
    fullWidth,
    icon,
    kind = 'flat',
    showArrow,
    size = 'medium',
    spacingConfig,
    style,
    textStyle,
    variant = 'primary',
    ...props
}) => {
    const spacing = spacingConfig ?? getSpacingConfig(size);
    const colors = colorConfig ?? getButtonColors(colorMode, variant, kind);
    const customTextStyle = textStyle ?? getTextStyle(size) ?? fontNameSpaces.th14b;
    const textColor = disabled ? colors?.disabledColors?.color : colors?.color;




    const { handleLayout, ...layout } = useLayout();

    const styles = useStyles({
        color: textColor,
        colorConfig: colors,
        disabled,
        elevationDirection,
        fullWidth,
        layout,
        spacingConfig: spacing,
    });

    return (
        <Pressable
            disabled={disabled}
            style={[styles.buttonWrapper, style]}
            onLayout={handleLayout}
            {...props}
        >
            {({ pressed }) => (
                <>
                    <View style={[styles.buttonFace, pressed && styles.buttonFacePressed, props.buttonStyle]}>
                        {icon && <Image source={icon} style={styles.icon} />}
                        <Typography
                            color={disabled ? 'rgba(255, 255, 255, 0.5)' : textColor}
                            {...customTextStyle}
                        >
                            {children}
                        </Typography>
                        {showArrow && <Pointer style={{ marginLeft: 10 }} color={textColor} />}
                    </View>
                    <View style={[styles.buttonEdge, styles.buttonEdgeLeft]} />
                    <View style={[styles.buttonEdge, styles.buttonEdgeTop]} />
                </>
            )}
        </Pressable>
    );
};

export default FlatButton;
