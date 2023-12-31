import * as React from 'react';
import { Image, Pressable, View } from 'react-native';
import useLayout from '../../../hooks/useLayout';
import { fontNameSpaces } from '../../../primitives';
import { getButtonColors, getSpacingConfig, getTextStyle } from '../../../primitives/buttons';
import { Pointer } from '../../Helpers';
import Typography from '../../Typography';
import useStyles from '../styles';
import { ButtonProps } from '../types';

const ElevatedButton: React.FC<ButtonProps> = ({
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
                    <View
                        style={[
                            styles.buttonFace,
                            styles.buttonFaceElevated,
                            pressed && styles.buttonFacePressed,
                        ]}
                    >
                        {icon && <Image source={icon} style={styles.icon} />}
                        <Typography
                            numberOfLines={1}
                            {...customTextStyle}
                            color={disabled ? 'rgba(255, 255, 255, 0.5)' : textColor}
                        >
                            {children}
                        </Typography>
                        {showArrow && <Pointer style={{ marginLeft: 10 }} color={textColor} />}
                    </View>
                    <View style={[styles.buttonEdge, styles.buttonEdgeTop]} />
                    <View style={[styles.buttonEdge, styles.buttonEdgeLeft]} />
                    <View
                        style={[
                            styles.buttonEdge,
                            styles.buttonEdgeBottom,
                            pressed && styles.buttonEdgeBottomPressed,
                        ]}
                    />
                    <View
                        style={[
                            styles.buttonEdge,
                            styles.buttonEdgeRight,
                            pressed && styles.buttonEdgeRightPressed,
                        ]}
                    />
                </>
            )}
        </Pressable>
    );
};

export default ElevatedButton;
