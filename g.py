# noinspection PyInterpreter
import argparse
import os

_PARSER = argparse.ArgumentParser()

_PARSER.add_argument('type')
_PARSER.add_argument('name')

_ARGS = _PARSER.parse_args()


def create_file(filename, content):
    """
    :param str filename:
    :type content: list[str]
    """
    with open(filename, 'w+') as fp:
        fp.write('\n'.join(content) + '\n')


def main():
    dirname = str(_ARGS.name).lower() # kebab/spinal-case
    camelcase_base = ''.join([x.capitalize() for x in dirname.split('-')])
    component_name = '%sComponent' % camelcase_base
    modal_name = '%sModal' % camelcase_base

    if _ARGS.type in ['page', 'p', 'Page']:
        os.chdir('app/components')
        os.makedirs(dirname)
        os.chdir(dirname)
        create_file('%s.component.ts' % dirname, ['import { Component, OnInit } from "@angular/core";',
                                        '', '', '@Component({', '    moduleId: __filename,', '    selector: "%s",' % dirname,
                                        '    templateUrl: "{dir}.component.html",'.format(dir=dirname),
                                        '    styleUrls: ["{dir}.component.scss"],'.format(dir=dirname),
                                        '})', '', 'export class %s implements OnInit { ' % component_name,
                                        '', '    ngOnInit() {', '', '    }' ,'}'])
        create_file('%s.component.html' % dirname, ['<StackLayout>', '', '</StackLayout>'])
        create_file('%s.component.scss' % dirname, ['%s{' % dirname, '', '}'])

    elif _ARGS.type in ['modal', 'm', 'Modal']:
        os.chdir('app/_shared')
        os.makedirs(dirname)
        os.chdir(dirname)
        create_file('%s.ts' % dirname, ['import { Component } from "@angular/core";',
                                        '', '@Component({', 'moduleId: __filename,', 'selector: "%s",' % dirname,
                                        'template: ``,',
                                        'styleUrls: ["%s.scss"],' % dirname,
                                        "})", "export class %s {" % modal_name,
                                        '', '}'])

        create_file('%s.html' % dirname, [''])


if __name__ == '__main__':
    main()