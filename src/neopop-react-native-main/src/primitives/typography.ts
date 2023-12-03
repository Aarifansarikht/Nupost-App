import { fonts } from '../../../utils/typography'
import { FontWeight } from '../components/Typography/types';
import { FontNameSpace } from '../types';

export const fontNameSpaces: Record<string, FontNameSpace> = {
    ...[44, 34, 28, 22, 20, 18, 16, 15, 14, 13].reduce(
        (acc: Record<string, object>, fontSize: number) => ({
            ...acc,
            [`th${fontSize}eb`]: {
                fontType: 'heading',
                fontSize,
                fontWeight: FontWeight.EXTRA_BOLD,
            },
        }),
        {},
    ),
    ...[34, 28, 22, 20, 18, 16, 14, 13, 11].reduce(
        (acc: Record<string, object>, fontSize: number) => ({
            ...acc,
            [`th${fontSize}b`]: {
                fontType: 'heading',
                fontSize,
                fontWeight: FontWeight.BOLD,
            },
        }),
        {},
    ),
    ...[22, 20, 18, 16, 14, 13, 12, 10].reduce(
        (acc: Record<string, object>, fontSize: number) => ({
            ...acc,
            [`th${fontSize}sb`]: {
                fontType: 'heading',
                fontSize,
                fontWeight: FontWeight.SEMI_BOLD,
            },
        }),
        {},
    ),
    ...[16, 15, 14, 13, 12, 11].reduce(
        (acc: Record<string, object>, fontSize: number) => ({
            ...acc,
            [`tb${fontSize}m`]: {
                fontType: 'body',
                fontSize,
                fontWeight: FontWeight.MEDIUM,
            },
        }),
        {},
    ),
    ...[16, 15, 14, 13, 12, 11].reduce(
        (acc: Record<string, object>, fontSize: number) => ({
            ...acc,
            [`tb${fontSize}r`]: {
                fontType: 'body',
                fontSize,
                fontWeight: FontWeight.REGULAR,
            },
        }),
        {},
    ),
    tc12eb: {
        fontType: 'caps',
        fontSize: 12,
        fontWeight: FontWeight.EXTRA_BOLD,
    },
    tc10eb: {
        fontType: 'caps',
        fontSize: 10,
        fontWeight: FontWeight.EXTRA_BOLD,
    },
    tc12b: {
        fontType: 'caps',
        fontSize: 12,
        fontWeight: FontWeight.BOLD,
    },
    tc10b: {
        fontType: 'caps',
        fontSize: 10,
        fontWeight: FontWeight.BOLD,
    },
    tc8b: {
        fontType: 'caps',
        fontSize: 8,
        fontWeight: FontWeight.BOLD,
    },
    tc12sb: {
        fontType: 'caps',
        fontSize: 12,
        fontWeight: FontWeight.SEMI_BOLD,
    },
    tc10sb: {
        fontType: 'caps',
        fontSize: 10,
        fontWeight: FontWeight.SEMI_BOLD,
    },
    ...[36, 34, 32, 24, 22, 20, 18].reduce(
        (acc: Record<string, object>, fontSize: number) => ({
            ...acc,
            [`tsh${fontSize}b`]: {
                fontType: 'serif-heading',
                fontSize,
                fontWeight: FontWeight.BOLD,
            },
        }),
        {},
    ),
};

export const fontVariant: Record<string, FontNameSpace> = {
    HeadingExtraBold44: {
        fontType: 'heading',
        fontSize: 44,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold34: {
        fontType: 'heading',
        fontSize: 34,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold28: {
        fontType: 'heading',
        fontSize: 28,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold22: {
        fontType: 'heading',
        fontSize: 22,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold20: {
        fontType: 'heading',
        fontSize: 20,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold18: {
        fontType: 'heading',
        fontSize: 18,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold16: {
        fontType: 'heading',
        fontSize: 16,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold15: {
        fontType: 'heading',
        fontSize: 15,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold14: {
        fontType: 'heading',
        fontSize: 14,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingExtraBold13: {
        fontType: 'heading',
        fontSize: 13,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    HeadingBold34: {
        fontType: 'heading',
        fontSize: 34,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold28: {
        fontType: 'heading',
        fontSize: 28,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold22: {
        fontType: 'heading',
        fontSize: 22,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold20: {
        fontType: 'heading',
        fontSize: 20,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold18: {
        fontType: 'heading',
        fontSize: 18,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold16: {
        fontType: 'heading',
        fontSize: 16,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold14: {
        fontType: 'heading',
        fontSize: 14,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold13: {
        fontType: 'heading',
        fontSize: 13,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold12: {
        fontType: 'heading',
        fontSize: 12,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingBold11: {
        fontType: 'heading',
        fontSize: 11,
        fontFamily: fonts.Font_Primary_Bold
    },
    HeadingSemiBold22: {
        fontType: 'heading',
        fontSize: 22,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    HeadingSemiBold20: {
        fontType: 'heading',
        fontSize: 20,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    HeadingSemiBold18: {
        fontType: 'heading',
        fontSize: 18,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    HeadingSemiBold16: {
        fontType: 'heading',
        fontSize: 16,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    HeadingSemiBold14: {
        fontType: 'heading',
        fontSize: 14,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    HeadingSemiBold13: {
        fontType: 'heading',
        fontSize: 13,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    HeadingSemiBold12: {
        fontType: 'heading',
        fontSize: 12,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    HeadingSemiBold10: {
        fontType: 'heading',
        fontSize: 10,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    BodyMedium20: {
        fontType: 'body',
        fontSize: 20,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyMedium18: {
        fontType: 'body',
        fontSize: 18,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyMedium16: {
        fontType: 'body',
        fontSize: 16,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyMedium15: {
        fontType: 'body',
        fontSize: 15,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyMedium14: {
        fontType: 'body',
        fontSize: 14,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyMedium13: {
        fontType: 'body',
        fontSize: 13,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyMedium12: {
        fontType: 'body',
        fontSize: 12,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyMedium11: {
        fontType: 'body',
        fontSize: 11,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyMedium10: {
        fontType: 'body',
        fontSize: 10,
        fontFamily: fonts.Font_Primary_Medium
    },
    BodyRegular16: {
        fontType: 'body',
        fontSize: 16,
        fontFamily: fonts.Font_Primary_Regular
    },
    BodyRegular15: {
        fontType: 'body',
        fontSize: 15,
        fontFamily: fonts.Font_Primary_Regular
    },
    BodyRegular14: {
        fontType: 'body',
        fontSize: 14,
        fontFamily: fonts.Font_Primary_Regular
    },
    BodyRegular13: {
        fontType: 'body',
        fontSize: 13,
        fontFamily: fonts.Font_Primary_Regular
    },
    BodyRegular12: {
        fontType: 'body',
        fontSize: 12,
        fontFamily: fonts.Font_Primary_Regular
    },
    BodyRegular11: {
        fontType: 'body',
        fontSize: 11,
        fontFamily: fonts.Font_Primary_Regular
    },
    BodyRegular10: {
        fontType: 'body',
        fontSize: 10,
        fontFamily: fonts.Font_Primary_Regular
    },
    BodyRegular9: {
        fontType: 'body',
        fontSize: 9,
        fontFamily: fonts.Font_Primary_Regular
    },
    CapsExtraBold12: {
        fontType: 'caps',
        fontSize: 12,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    CapsExtraBold10: {
        fontType: 'caps',
        fontSize: 10,
        fontFamily: fonts.Font_Primary_ExtraBold
    },
    CapsBold12: {
        fontType: 'caps',
        fontSize: 12,
        fontFamily: fonts.Font_Primary_Bold
    },
    CapsBold10: {
        fontType: 'caps',
        fontSize: 10,
        fontFamily: fonts.Font_Primary_Bold
    },
    CapsBold8: {
        fontType: 'caps',
        fontSize: 8,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    CapsSemiBold12: {
        fontType: 'caps',
        fontSize: 12,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    CapsSemiBold10: {
        fontType: 'caps',
        fontSize: 10,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    CapsSemiBold8: {
        fontType: 'caps',
        fontSize: 8,
        fontFamily: fonts.Font_Primary_SemiBold
    },
    CirkaHeadingBold36: {
        fontType: 'serif-heading',
        fontSize: 36,
        fontFamily: fonts.Font_Secondary_Bold
    },
    CirkaHeadingBold34: {
        fontType: 'serif-heading',
        fontSize: 34,
        fontFamily: fonts.Font_Secondary_Bold
    },
    CirkaHeadingBold32: {
        fontType: 'serif-heading',
        fontSize: 32,
        fontFamily: fonts.Font_Secondary_Bold
    },
    CirkaHeadingBold24: {
        fontType: 'serif-heading',
        fontSize: 24,
        fontFamily: fonts.Font_Secondary_Bold
    },
    CirkaHeadingBold22: {
        fontType: 'serif-heading',
        fontSize: 22,
        fontFamily: fonts.Font_Secondary_Bold
    },
    CirkaHeadingBold20: {
        fontType: 'serif-heading',
        fontSize: 20,
        fontFamily: fonts.Font_Secondary_Bold
    },
    CirkaHeadingBold18: {
        fontType: 'serif-heading',
        fontSize: 18,
        fontFamily: fonts.Font_Secondary_Bold
    },
};

export const typographyGuide = {
    back: {
        heading: fontVariant.HeadingSemiBold14,
    },
    header: {
        heading: fontVariant.CirkaHeadingBold24,
        description: fontVariant.BodyMedium14,
    },
    containerCard: {
        heading: fontVariant.HeadingBold14,
        description: fontVariant.BodyMedium13,
    },
    bottomSheet: {},
    tags: {
        containerText: fontVariant.CapsBold8,
        noContainerText: fontVariant.CapsBold10,
    },
    searchBar: {
        input: fontVariant.HeadingSemiBold13,
    },
    buttons: {
        big: fontVariant.HeadingBold14,
        medium: fontVariant.HeadingBold13,
        small: fontVariant.HeadingBold11,
    },
    checkbox: {},
    toast: {
        heading: fontVariant.HeadingSemiBold13,
        description: fontVariant.BodyRegular11,
    },
    inputFields: {
        label: fontVariant.CapsBold10,
        text: fontVariant.HeadingBold22,
    },
};
